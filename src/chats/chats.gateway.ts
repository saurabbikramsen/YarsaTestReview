import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import {
  BroadcastAllDto,
  ChatDto,
  ChatsDto,
  ConnectionDto,
  JoinRoomDto,
  MessageRoomDto,
} from './Dto/chat.dto';
import { CommonUtils } from '../utils/common.utils';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly prisma: PrismaService,
    private utils: CommonUtils,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @AsyncApiSub({
    channel: 'connect',
    summary: 'connect',
    operationId: 'connect',
    description: 'it is used to connect to the server using socket',
    message: {
      payload: ConnectionDto,
      headers: {
        authorization: {
          description: 'Bearer access token of the user',
        },
      },
    },
  })
  async handleConnection(client: Socket) {
    try {
      const decodedToken = await this.verifyUser(client);
      const player = await this.prisma.player.findUnique({
        where: { id: decodedToken.id },
      });
      if (player && player.active == true) {
        client.data.user = player;
        await this.cacheManager.set(player.id, client.id, 86399980);
      } else throw new BadRequestException('you are not eligible');
    } catch (error) {
      console.log('inside error');
      client.disconnect(true);
      return 'disconnected';
    }
  }

  @SubscribeMessage('privateMessage')
  @AsyncApiPub({
    channel: 'privateMessage',
    operationId: 'privateMessage',
    summary: 'privateMessage',
    description:
      'it uses recipient id to send message to other connected users and returns senders id and message ' +
      'emittedResponse = {' +
      'message: string,  ' +
      'senderId: string' +
      '}',
    message: {
      payload: ChatDto,
    },
  })
  async handlePrivateMessage(
    client: Socket,
    data: { recipientId: string; message: string },
  ) {
    const { recipientId, message } = data;
    const sender = client.data.user;
    const recipientSocket: string = await this.cacheManager.get(recipientId);
    this.server
      .to([recipientSocket, client.id])
      .emit('privateMessage', { message: message, sender: sender.id });

    await this.prisma.chats.create({
      data: {
        sender_id: sender.id,
        receiver_id: recipientId,
        message: message,
      },
    });
  }

  @SubscribeMessage('join_room')
  @AsyncApiSub({
    channel: 'join_room',
    summary: 'join_room',
    operationId: 'join_room',
    description:
      'it joins a user to a room using the room name  ' +
      'response = {' +
      'message: string' +
      '}',
    message: {
      payload: JoinRoomDto,
    },
  })
  async joinRoom(client: Socket, data: { roomName: string }) {
    const { roomName } = data;
    const player = client.data.user;
    await this.prisma.rooms.upsert({
      where: { name: roomName },
      update: { players: { connect: { id: player.id } } },
      create: { name: roomName, players: { connect: { id: player.id } } },
    });
    this.server.in(client.id).socketsJoin(roomName);
    return { message: roomName + ' joined successfully' };
  }

  @SubscribeMessage('message_room')
  @AsyncApiPub({
    channel: 'message_room',
    summary: 'message_room',
    operationId: 'message_room',
    description:
      'provide room name and message to broadcast the message to all the users in the room ' +
      'emittedResponse = {' +
      'message : string, sender_id : string, receiver_id: string' +
      '}',
    message: {
      payload: MessageRoomDto,
    },
  })
  async sendMsgRoom(
    client: Socket,
    data: {
      roomName: string;
      message: string;
    },
  ) {
    const { roomName, message } = data;
    const sender = client.data.user;
    const room = await this.prisma.rooms.findUnique({
      where: { name: roomName },
    });
    if (room) {
      const chat = await this.prisma.chats.create({
        data: { sender_id: sender.id, message, receiver_id: roomName },
      });
      await this.prisma.rooms.update({
        where: { id: room.id },
        data: { chats: { connect: { id: chat.id } } },
      });
    } else {
      throw new NotFoundException('no room available');
    }
    this.server
      .to(roomName)
      .emit('message_room', { message, sender: sender.id, roomName });
  }

  @SubscribeMessage('leave_room')
  @AsyncApiSub({
    channel: 'leave_room',
    summary: 'leave_room',
    operationId: 'leave_room',
    description:
      'leave a room by providing room name ' +
      'response = {' +
      'message : string' +
      '}',
    message: {
      payload: JoinRoomDto,
    },
  })
  async leaveRoom(client: Socket, data: { roomName: string }) {
    const { roomName } = data;
    const sender = client.data.user;
    client.leave(roomName);
    const room = await this.prisma.rooms.findUnique({
      where: { name: roomName },
    });
    if (room) {
      await this.prisma.rooms.update({
        where: { name: roomName },
        data: { players: { disconnect: { id: sender.id } } },
      });
      const roomPlayers = await this.prisma.rooms.findUnique({
        where: { name: roomName },
        select: { players: true },
      });
      if (roomPlayers.players.length == 0) {
        await this.prisma.rooms.delete({ where: { name: roomName } });
      }
      return { message: roomName + ' left successfully' };
    } else return { message: 'there is no such room ' + roomName };
  }
  @SubscribeMessage('message_all')
  @AsyncApiPub({
    channel: 'message_all',
    summary: 'message_all',
    operationId: 'message_all',
    description:
      'used to broadcast message to all the subscribed users ' +
      'emittedResponse = {' +
      'message : string, senderId: string ' +
      '}',
    message: {
      payload: BroadcastAllDto,
    },
  })
  async broadCastToAll(client: Socket, data: { message: string }) {
    const { message } = data;
    const sender = client.data.user;

    this.server.emit('message', { message: message, senderId: sender.id });
  }

  async handleDisconnect(client: Socket) {
    const player = client.data.user;
    if (player) await this.cacheManager.del(player.id);
  }
  async verifyUser(client: Socket) {
    const token = client.handshake.headers.authorization;
    const realToken = token.slice(7, token.length);
    return this.utils.decodeAccessToken(realToken);
  }

  async getPersonalChats(senderId: string, receiverId: string) {
    const players = [senderId, receiverId];
    return this.prisma.chats.findMany({
      where: {
        AND: [{ sender_id: { in: players } }, { receiver_id: { in: players } }],
      },
      select: {
        sender_id: true,
        message: true,
        id: true,
        created_at: true,
        receiver_id: true,
      },
    });
  }

  async getAllRooms() {
    return this.prisma.rooms.findMany({
      select: { name: true, players: { select: { name: true, id: true } } },
    });
  }

  async getRoomChats(roomName: string) {
    return this.prisma.rooms.findUnique({
      where: { name: roomName },
      select: { name: true, chats: true, players: true },
    });
  }

  async updateChats(id: string, chatsData: ChatsDto) {
    await this.findChat(id);
    await this.prisma.chats.update({
      where: { id },
      data: { message: chatsData.message },
    });
    return { message: 'Chat updated successfully' };
  }

  async deleteChat(id: string) {
    await this.findChat(id);
    await this.prisma.chats.delete({ where: { id } });
    return { message: 'message deleted successfully' };
  }

  async findChat(id: string) {
    const chat = await this.prisma.chats.findUnique({ where: { id } });
    if (!chat) {
      throw new NotFoundException('chat not present');
    }
  }
}
