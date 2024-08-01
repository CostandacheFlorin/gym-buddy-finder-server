// src/interests/interest.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interest } from '../schemas/interest.schema';
import { gymRelatedInterests, nonGymRelatedInterests } from './dummy-data';

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

  async filterByGymRelated(gymRelated: boolean): Promise<Interest[]> {
    return this.interestModel.find({ gymRelated });
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

  async seedDefaultInterests() {
    try {
      await this.seedInterests(gymRelatedInterests, true);
      await this.seedInterests(nonGymRelatedInterests, false);

      console.log('Default interests seeded successfully.');
    } catch (error) {
      console.error('Error seeding default interests:', error);
    }
  }

  private async seedInterests(
    interests: Partial<Interest>[],
    gymRelated: boolean,
  ) {
    for (const interest of interests) {
      const existingInterest = await this.interestModel.findOne({
        name: interest.name,
      });

      if (!existingInterest) {
        await this.interestModel.create({
          name: interest.name,
          description: interest.description,
          gymRelated: gymRelated,
        });
      }
    }
  }
}
