import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/response.interface';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(data: UserLoginDto): Promise<ApiResponse<any>> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!user) {
      throw new NotFoundException(`User tidak ditemukan`);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException(`User tidak ditemukan`);
    }

    const payload = { id: user.id, name: user.name, role: user.role };

    return {
      success: true,
      message: 'successfully login',
      data: {
        ...payload,
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
