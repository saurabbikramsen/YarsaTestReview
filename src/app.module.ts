import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { CommonModule } from './utils/common.module';
import { PlayerModule } from './player/player.module';
import { SseModule } from './serverSentEvents/sse.module';
import { ChatsModule } from './chats/chats.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    PrismaModule,
    JwtModule,
    UserModule,
    CommonModule,
    PlayerModule,
    SseModule,
    ChatsModule,
  ],

  exports: [JwtModule],
})
export class AppModule {}
