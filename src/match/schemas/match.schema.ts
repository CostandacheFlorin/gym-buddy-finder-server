import { Schema } from 'mongoose';
import { MatchStatus } from 'src/types/match';

export const MatchSchema = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    initiator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user1Status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.PENDING,
    },
    user2Status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.PENDING,
    },
    status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.PENDING,
    },
    matched_at: { type: Date },
  },
  { timestamps: true },
);
