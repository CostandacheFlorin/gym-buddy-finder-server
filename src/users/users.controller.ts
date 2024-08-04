import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { ErrorResponse } from 'utils/errorResponse';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/matching-list')
  async listUsersToMatch(
    @Query('skip') skip: number = 1,
    @Query('limit') limit: number = 10,
    @Query('user_id') userId: string,
  ) {
    return await this.usersService.findUsersWithMatchersFirst(
      userId,
      skip,
      limit,
    );
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @Get('/me')
  async getMe() {
    try {
      return await this.usersService.findOne('66ab371036d28d0ef8e4094c');
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
