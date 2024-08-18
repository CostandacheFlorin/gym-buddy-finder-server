import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message/create-message.dto';
import { UpdateMessageDto } from './dto/update-message/update-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto);
  }

  @UseGuards(AuthGuard)
  @Get(':userId1/:userId2')
  async findMessagesBetweenUsers(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.messagesService.findMessagesBetweenUsers(userId1, userId2);
  }

  @UseGuards(AuthGuard)
  @Put(':messageId')
  async update(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req,
  ) {
    return this.messagesService.updateMessage(
      messageId,
      req.user.id,
      updateMessageDto,
    );
  }
}
