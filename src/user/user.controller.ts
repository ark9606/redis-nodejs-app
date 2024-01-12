import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @Get('/')
  async getUsers() {

  }

  @Post('/')
  async createUser(@Body() body) {
    return this.service.createUser(body);
  }
}
