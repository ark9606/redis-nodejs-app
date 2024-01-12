import {Inject, Injectable} from '@nestjs/common';
import {INJECTION_TOKEN} from "../constants";
import {RedisClientType} from "redis";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @Inject(INJECTION_TOKEN.REDIS)
    private readonly redisClient: RedisClientType,
  ) {
  }

  public async getUsers(): Promise<any> {
    // const res = await this.redisClient.sca('user:*');
    return [];
  }

  public async createUser(dto: {
    name: string;
    email: string;
    age: number;
    dreams: string[];
  }): Promise<any> {
    const user = {
      id: uuidv4(),
      name: dto.name,
      age: dto.age,
      email: dto.email,
      dreams: dto.dreams,
    };
    const res = await this.redisClient.hSet('user:' + user.id, ['name', user.name, 'email', user.email, 'age', user.age, 'dreams', JSON.stringify(user.dreams)]);
    console.log(res)
    const savedUser = await this.redisClient.hGetAll('user:' + user.id);
    // index for getting by email
    await this.redisClient.set('user.email:' + user.email, user.id);
    savedUser.id = user.id;
    savedUser.dreams = JSON.parse(savedUser.dreams);
    return savedUser;
  }
}
