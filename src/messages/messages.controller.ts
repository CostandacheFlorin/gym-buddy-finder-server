import { Controller, Get, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ErrorResponse } from 'utils/errorResponse';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getAllMessages() {
    try {
      return await this.messagesService.getAllMessages();
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @Post()
  async addMessage(@Body() message: any) {
    try {
      return await this.messagesService.addMessage(message);
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
