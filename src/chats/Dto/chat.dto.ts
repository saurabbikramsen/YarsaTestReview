import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
export class ChatRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomName: string;
}

export class PersonalChatsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  receiverId: string;
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

export class ConnectionDto {}
