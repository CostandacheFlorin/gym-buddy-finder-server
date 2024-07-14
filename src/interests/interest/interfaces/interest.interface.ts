import { Document } from 'mongoose';

export interface Interest extends Document {
  readonly name: string;
  readonly description: string;
  readonly gymRelated: boolean;
}
