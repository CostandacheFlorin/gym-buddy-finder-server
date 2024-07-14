import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
