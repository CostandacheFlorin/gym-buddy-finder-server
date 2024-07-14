// src/interests/interest.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interest } from '../schemas/interest.schema';

@Injectable()
export class InterestService {
  constructor(
    @InjectModel(Interest.name) private readonly interestModel: Model<Interest>,
  ) {}

  async create(createInterestDto: Partial<Interest>): Promise<Interest> {
    const createdInterest = new this.interestModel(createInterestDto);
    return createdInterest.save();
  }

  async findAll(): Promise<Interest[]> {
    return this.interestModel.find().exec();
  }

  async findById(id: string): Promise<Interest> {
    return this.interestModel.findById(id).exec();
  }

  async update(
    id: string,
    updateInterestDto: Partial<Interest>,
  ): Promise<Interest> {
    return this.interestModel
      .findByIdAndUpdate(id, updateInterestDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Interest> {
    return this.interestModel.findOneAndDelete({ _id: id }).exec();
  }
}
