import {Inject, Injectable} from '@nestjs/common';
import {INJECTION_TOKEN} from "./constants";
import {RedisClientType} from "redis";

@Injectable()
export class AppService {
  constructor(
    @Inject(INJECTION_TOKEN.REDIS)
    private readonly redisClient: RedisClientType,
  ) {
  }
  async getHello(): Promise<string> {
    let value: string | null = await this.redisClient.get('test1');
    console.log('get', value);
    if (!value) {
      const res = await this.redisClient.set('test1', 'value555');
      console.log('set', res);
      value = await this.redisClient.get('test1');
      console.log('get', value);
    }
    return `Hello, ${value}`;
  }
}
