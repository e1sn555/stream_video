import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user && !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException();
    }
  }
}
