import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user/update-user.dto';
import { ErrorResponse } from 'src/utils/errorResponse';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/matching-list')
  async listUsersToMatch(
    @Request() req,
    @Query('skip') skip: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.usersService.findUsersWithMatchersFirst(
      req.user.id,
      skip,
      limit,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@Request() req) {
    try {
      const user = await this.usersService.findOneById(req.user.id);
      if (!user) {
        throw new NotFoundException(`User with ID  not found`);
      }
      return user;
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOneById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
