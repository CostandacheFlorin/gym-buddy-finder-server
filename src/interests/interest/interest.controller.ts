// src/interests/interest.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { Interest } from '../schemas/interest.schema';

@Controller('interests')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Post()
  async create(
    @Body() createInterestDto: Partial<Interest>,
  ): Promise<Interest> {
    return this.interestService.create(createInterestDto);
  }

  @Post('seed')
  async seed() {
    return this.interestService.seedDefaultInterests();
  }

  @Get()
  async findAll(): Promise<Interest[]> {
    return this.interestService.findAll();
  }

  @Get('type')
  async filterByGymRelated(
    @Query('gymRelated') gymRelated: boolean,
  ): Promise<Interest[]> {
    return this.interestService.filterByGymRelated(gymRelated);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Interest> {
    return this.interestService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInterestDto: Partial<Interest>,
  ): Promise<Interest> {
    return this.interestService.update(id, updateInterestDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Interest> {
    return this.interestService.delete(id);
  }
}
