import { Schema } from 'mongoose';
import { Gender } from 'types/user';

export const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birth_date: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: Object.values(Gender), required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  gymRelatedInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
  nonGymRelatedInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
  matches: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING',
      },
    },
  ],
  pictures: [
    {
      _id: { type: Schema.Types.ObjectId },
      url: { type: String, required: true },
    },
  ],
});
