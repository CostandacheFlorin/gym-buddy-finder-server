import { Schema, Types } from 'mongoose';
import { MessageStatus } from '../types';

export const MessageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, required: true, ref: 'User' },
    receiver: { type: Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: MessageStatus,
      default: 'sent',
    },
    edited: { type: Boolean, default: false }, // New field to track if the message was edited
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
);
