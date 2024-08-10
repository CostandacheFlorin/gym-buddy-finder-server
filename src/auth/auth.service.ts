import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorResponse } from 'utils/errorResponse';
import hashPassword from 'utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<string> {
    try {
      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Wrong credentials');
      }
      if (!(await bcrypt.compare(pass, user.hashed_password))) {
        throw new UnauthorizedException('Wrong credentials!');
      }

      const payload = { sub: user.id, email: user.email, id: user.id };

      return this.jwtService.signAsync(payload);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  async register(data: RegisterDto) {
    try {
      const existingUser = await this.usersService.findOne({
        email: data.email,
      });

      if (existingUser) {
        throw new Error('Email already used!');
      }
      const { password, ...rest } = data;

      const hashed_password = await hashPassword(password);

      const newUser = await new this.userModel({
        ...rest,
        hashed_password,
      }).save();
      const userObject = newUser.toObject();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashed_password: user_hashed_password, ...restOfUser } =
        userObject;

      return restOfUser;
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
