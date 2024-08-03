import { Schema } from 'mongoose';
import { Gender } from 'types/user';

export const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birth_date: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: Object.values(Gender), required: true },
  description: { type: String },
  country: { type: String, required: true },
  city: { type: String, required: true },
  gyms: [{ type: String }],
  gymRelatedInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
  nonGymRelatedInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
  pictures: [
    {
      _id: { type: Schema.Types.ObjectId },
      url: { type: String, required: true },
    },
  ],
});
