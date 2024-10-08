import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { ErrorResponse } from '../utils/errorResponse';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      const token = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );

      // Set the HTTP-only cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 * 30,
      });

      return res.json({ message: 'Login successful' });
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    try {
      return this.authService.register(payload);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      return res.json({ message: 'Logout successful' });
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
