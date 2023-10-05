import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { ChatsController } from './chats.controller';

@Module({
  providers: [ChatsGateway],
  controllers: [ChatsController],
})
export class ChatsModule {}
