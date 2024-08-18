import { Types, Document } from 'mongoose';
import { MessageStatus } from '../types';

export interface Message extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  edited: boolean;
}
