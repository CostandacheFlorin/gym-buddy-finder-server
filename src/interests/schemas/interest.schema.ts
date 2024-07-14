// src/interests/interest.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Interest extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  gymRelated: boolean;
}

export const InterestSchema = SchemaFactory.createForClass(Interest);
