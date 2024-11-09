import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() data: UserLoginDto) {
    return this.userService.loginUser(data);
  }
}
