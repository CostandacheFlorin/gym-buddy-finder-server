import { Document } from 'mongoose';
import { MatchStatus } from 'types/match';

export interface Match extends Document {
  user1: string;
  user2: string;
  initiator: string;
  user1Status: MatchStatus;
  user2Status: MatchStatus;
  status: MatchStatus;
  matched_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
