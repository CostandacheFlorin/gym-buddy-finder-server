import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './interfaces/message.interface';
import { CreateMessageDto } from './dto/create-message/create-message.dto';
import { UpdateMessageDto } from './dto/update-message/update-message.dto';
import { MatchService } from '../match/match.service';
import { User } from '../users/interfaces/user.interface';
import { ErrorResponse } from '../utils/errorResponse';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('User') private readonly userModel: Model<User>,

    private readonly matchService: MatchService,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
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

  async retrieveMessagesBetweenUsers(
    user1_id: string,
    user2_id: string,
    skip: number = 0,
    limit: number = 10,
  ) {
    try {
      const messages = await this.messageModel
        .find({
          $or: [
            { sender: user1_id, receiver: user2_id },
            { sender: user2_id, receiver: user1_id },
          ],
        })
        .skip(skip)
        .limit(limit)
        .sort({ timestamp: -1 })
        .exec();

      const user1 = await this.userModel.findById(user1_id);
      const user2 = await this.userModel.findById(user2_id);

      return {
        user1,
        user2,
        messages: messages.reverse(),
      };
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  async retrieveLastChats(user_id: string) {
    try {
      const userObjectId = new Types.ObjectId(user_id);

      // Step 1: Get all matched user data
      const matches = await this.matchService.listMatchesForUserId(user_id);

      // Step 2: Get the last message for each matched user
      const lastMessages = await this.messageModel
        .aggregate([
          {
            $match: {
              $or: [{ sender: userObjectId }, { receiver: userObjectId }],
            },
          },
          {
            $sort: { timestamp: -1 }, // Sort by timestamp descending
          },
          {
            $group: {
              _id: {
                $cond: [
                  { $eq: ['$sender', userObjectId] },
                  '$receiver',
                  '$sender',
                ],
              },
              lastMessage: { $first: '$$ROOT' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'otherUser',
            },
          },
          {
            $unwind: {
              path: '$otherUser',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              otherUser: 1,
              lastMessage: 1,
            },
          },
          {
            $sort: { 'lastMessage.timestamp': -1 },
          },
        ])
        .exec();

      // Step 3: Find users with no messages
      const usersWithMessages = new Set(
        lastMessages.map((chat) => chat._id.toString()),
      );

      const usersWithoutMessages = matches
        .filter((match) => {
          const otherUserId =
            // @ts-expect-error Match.user1 should be of type User, not string because of the populate function
            match.user1._id.toString() === user_id
              ? // @ts-expect-error same as above

                match.user2._id.toString()
              : // @ts-expect-error same as above

                match.user1._id.toString();

          return !usersWithMessages.has(otherUserId);
        })
        .map((match) => {
          const otherUser =
            // @ts-expect-error same as above
            match.user1._id.toString() === user_id ? match.user2 : match.user1;
          return {
            otherUser,
            lastMessage: null,
          };
        });

      // Step 4: Combine results - Users with no messages first, followed by those with messages
      const finalResults = [
        ...usersWithoutMessages,
        ...lastMessages.map((chat) => ({
          otherUser: chat.otherUser,
          lastMessage: chat.lastMessage,
        })),
      ];

      return finalResults;
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
