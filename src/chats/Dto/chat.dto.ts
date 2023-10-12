import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatDto {
  @ApiProperty({ description: 'Id of the receiver' })
  recipientId: string;
  @ApiProperty({ description: 'Personal message for the receiver' })
  message: string;
}

export class JoinRoomDto {
  @ApiProperty({ description: 'Name of the room to join' })
  roomName: string;
}
export class MessageRoomDto {
  @ApiProperty({
    description: 'Name of the room where the message will be sent',
  })
  roomName: string;

  @ApiProperty({ description: 'Message to be sent to the room' })
  message: string;
}
export class BroadcastAllDto {
  @ApiProperty({
    description: 'Message to boradcast to all the connected users',
  })
  message: string;
}

export class PersonalChatsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  message: string;
}

export class ChatsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
export class RoomChatsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  message: string;

  @ApiProperty()
  roomName: string;
}

export class PlayerNameId {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
}
export class AllRoomResponse {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    isArray: true,
  })
  @Type(() => PlayerNameId)
  player: PlayerNameId;
}
export class ConnectionDto {}
