import { ChatsGateway } from './chats.gateway';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ChatsDto,
  JoinRoomDto,
  PersonalChatsResponseDto,
  RoomChatsResponseDto,
} from './Dto/chat.dto';
import { PlayerAuthGuard } from '../player/guard/playerAuth.guard';

@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsGateway) {}

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all the personal chats between two players' })
  @ApiResponse({ type: PersonalChatsResponseDto })
  @ApiQuery({ name: 'senderId', required: true, type: String })
  @ApiQuery({ name: 'receiverId', required: true, type: String })
  @Get('personal')
  async personalChats(
    @Query('senderId') senderId: string,
    @Query('receiverId') receiverId: string,
  ) {
    return this.chatsService.getPersonalChats(senderId, receiverId);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all available rooms' })
  @ApiResponse({ type: [JoinRoomDto] })
  @Get('allRoom')
  async getAllRooms() {
    return this.chatsService.getAllRooms();
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all the chats of a particular room' })
  @ApiResponse({ type: RoomChatsResponseDto })
  @ApiQuery({ name: 'roomName', required: true, type: String })
  @Get('room')
  async roomChats(@Query('roomName') roomName: string) {
    return this.chatsService.getRoomChats(roomName);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update the chat message' })
  @ApiResponse({ type: ChatsDto })
  @Put('/:id')
  async updateChats(@Param('id') id: string, @Body() updateData: ChatsDto) {
    return this.chatsService.updateChats(id, updateData);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete the chat message' })
  @ApiResponse({ type: ChatsDto })
  @Delete('/:id')
  async deleteChats(@Param('id') id: string) {
    return this.chatsService.deleteChat(id);
  }
}
