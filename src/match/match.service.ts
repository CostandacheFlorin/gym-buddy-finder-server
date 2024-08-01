// src/match/match.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './interfaces/match.interface';
import { MatchStatus } from 'types/match';

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
        { user1: initiatorId, user2: receiverId },
        { user1: receiverId, user2: initiatorId },
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

    // Optionally, update matched_at if both users have accepted the match
    if (
      match.user1Status === MatchStatus.MATCHED &&
      match.user2Status === MatchStatus.MATCHED
    ) {
      match.matched_at = new Date();
    }

    return match.save();
  }

  async listUserIdsByMatchStatusForUserId(
    userId: string,
    status: MatchStatus,
  ): Promise<string[]> {
    const matches = await this.matchModel.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: status,
    });

    const userIds = matches.map((match) => {
      if (match.user1.toString() === userId) {
        return match.user2.toString();
      }
      return match.user1.toString();
    });

    return userIds.filter((id) => id !== undefined);
  }
}
