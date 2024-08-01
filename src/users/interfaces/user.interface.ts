import { Document, Schema } from 'mongoose';
import { Gender } from 'types/user';

export interface User extends Document {
  first_name: string;
  last_name: string;
  birth_date: Date;
  email: string;
  gender: Gender;
  gyms: string[];
  gymRelatedInterests: Schema.Types.ObjectId[];
  nonGymRelatedInterests: Schema.Types.ObjectId[];
  pictures: [{ _id: Schema.Types.ObjectId; url: string }];
}
