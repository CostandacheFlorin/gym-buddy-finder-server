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
import { ErrorResponse } from 'utils/errorResponse';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    try {
      return this.messagesService.createMessage(createMessageDto);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':messageId')
  async update(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req,
  ) {
    try {
      return this.messagesService.updateMessage(
        messageId,
        req.user.id,
        updateMessageDto,
      );
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/latest-chats')
  async retrieveLastChats(@Request() req) {
    try {
      return this.messagesService.retrieveLastChats(req.user.id);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:userId')
  async listMessagesWithUser(@Param('userId') userId: string, @Request() req) {
    try {
      return this.messagesService.retrieveMessagesBetweenUsers(
        req.user.id,
        userId,
      );
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
