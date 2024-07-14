import { Controller, Get, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getAllMessages() {
    return this.messagesService.getAllMessages();
  }

  @Post()
  addMessage(@Body() message: any) {
    this.messagesService.addMessage(message);
  }
}
