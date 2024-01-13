import {BadRequestException, Inject, Injectable} from '@nestjs/common';
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
    const skip = 0;
    const take = 10;
    // ordering by numeric value
    const userIds = await this.redisClient.zRange('userAges', skip, take, { REV: true });
    const users = await Promise.all(userIds.map(async id => {
      const user = await this.redisClient.hGetAll('user:' + id);
      user.id = id;
      user.dreams = JSON.parse(user.dreams);
      return user;
    }))
    return users;
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
    const userExists = await this.redisClient.get('user.email:' + user.email);
    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }

    const res = await this.redisClient.hSet('user:' + user.id, ['name', user.name, 'email', user.email, 'age', user.age, 'dreams', JSON.stringify(user.dreams)]);
    const savedUser = await this.redisClient.hGetAll('user:' + user.id);
    // index for getting by email
    await this.redisClient.set('user.email:' + user.email, user.id);
    // for sorting by age
    await this.redisClient.zAdd('userAges', {score: user.age, value: user.id});
    savedUser.id = user.id;
    savedUser.dreams = JSON.parse(savedUser.dreams);
    return savedUser;
  }
}
