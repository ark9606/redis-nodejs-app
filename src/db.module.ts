import { Module } from '@nestjs/common';
import {createClient, RedisClientType} from 'redis';
import {INJECTION_TOKEN} from "./constants";

let redisClient: RedisClientType | null = null;

@Module({
  imports: [],
  providers: [{
    provide: INJECTION_TOKEN.REDIS,
    useFactory: async (): Promise<RedisClientType> => {
      if (!redisClient) {
        redisClient = createClient();
        redisClient.on('error', err => console.log('Redis Client Error', err));
        await redisClient.connect();
        console.log('Redis client connected')
      }
      return redisClient;
    }
  }],
  exports: [INJECTION_TOKEN.REDIS]
})
export class DbModule {}
