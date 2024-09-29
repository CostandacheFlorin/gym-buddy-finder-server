// src/match/match.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from './interfaces/match.interface';
import { MatchStatus } from '../types/match';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
  ) {}

  async createOrUpdateMatch(
    initiatorId: string,
    receiverId: string,
    status: MatchStatus,
  ): Promise<Match> {
    const match = await this.matchModel.findOne({
      $or: [
        {
          user1: new Types.ObjectId(initiatorId),
          user2: new Types.ObjectId(receiverId),
        },
        {
          user1: new Types.ObjectId(receiverId),
          user2: new Types.ObjectId(initiatorId),
        },
      ],
    });

    if (!match) {
      const newMatch = {
        user1: initiatorId,
        user2: receiverId,
        initiator: initiatorId,
        user1Status: status, // Set user1's status based on initiator's action
        user2Status: MatchStatus.PENDING,
        status:
          status === MatchStatus.REJECTED
            ? MatchStatus.REJECTED
            : MatchStatus.PENDING,
      };
      return this.matchModel.create(newMatch);
    }

    if (match.user1.toString() === initiatorId) {
      match.user1Status = status;
    } else if (match.user2.toString() === initiatorId) {
      match.user2Status = status;
    } else {
      throw new Error('User not part of this match.');
    }

    if (
      match.user1Status === MatchStatus.MATCHED &&
      match.user2Status === MatchStatus.MATCHED
    ) {
      match.matched_at = new Date();
      match.status = MatchStatus.MATCHED;
    }

    if (
      match.user1Status === MatchStatus.REJECTED ||
      match.user2Status === MatchStatus.REJECTED
    ) {
      match.status = MatchStatus.REJECTED;
    }

    return match.save();
  }

  async listUserIdsByMatchStatusForUserId(
    userId: string,
    status: MatchStatus,
  ): Promise<string[]> {
    const matches = await this.matchModel.find({
      $or: [
        { user1: new Types.ObjectId(userId) },
        { user2: new Types.ObjectId(userId) },
      ],
      status: status,
    });

    const userIds = matches.map((match) => {
      if (match.user1.toString() === userId) {
        return match.user2;
      }
      return match.user1;
    });

    return userIds.filter((id) => id !== undefined);
  }

  async listMatchingUserIdsForUserId(userId: string): Promise<string[]> {
    const matches = await this.matchModel.find({
      $or: [
        {
          user1: new Types.ObjectId(userId),
          user2Status: MatchStatus.MATCHED,
          status: MatchStatus.PENDING,
        },
        {
          user2: new Types.ObjectId(userId),
          user1Status: MatchStatus.MATCHED,
          status: MatchStatus.PENDING,
        },
      ],
    });

    const userIds = matches.map((match) => {
      if (match.user1.toString() === userId) {
        return match.user2;
      }
      return match.user1;
    });

    return userIds;
  }

  async listMatchesForUserId(userId: string): Promise<Match[]> {
    return this.matchModel
      .find({
        $or: [
          {
            user1: new Types.ObjectId(userId),
            user2Status: MatchStatus.MATCHED,
            status: MatchStatus.MATCHED,
          },
          {
            user2: new Types.ObjectId(userId),
            user1Status: MatchStatus.MATCHED,
            status: MatchStatus.MATCHED,
          },
        ],
      })
      .populate({
        path: 'user1',
        select: '-hashed_password', // Exclude the password field from user1
      })
      .populate({
        path: 'user2',
        select: '-hashed_password', // Exclude the password field from user2
      });
  }
}
