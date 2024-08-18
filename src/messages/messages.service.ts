import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './interfaces/message.interface';
import { CreateMessageDto } from './dto/create-message/create-message.dto';
import { UpdateMessageDto } from './dto/update-message/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async findMessagesBetweenUsers(
    userId1: string,
    userId2: string,
  ): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
      })
      .sort({ timestamp: 1 })
      .exec(); // Sort by timestamp in ascending order
  }

  async updateMessage(
    messageId: string,
    userId: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.messageModel.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to edit this message',
      );
    }

    message.content = updateMessageDto.content;
    message.edited = true;

    if (updateMessageDto.status) {
      message.status = updateMessageDto.status;
    }

    return message.save();
  }
}
