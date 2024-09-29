import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { Interest } from '../schemas/interest.schema';
import { AuthGuard } from '../../auth/auth.guard';
import { ErrorResponse } from '../../utils/errorResponse';

@Controller('interests')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createInterestDto: Partial<Interest>,
  ): Promise<Interest> {
    try {
      return await this.interestService.create(createInterestDto);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @Post('seed')
  async seed() {
    try {
      return await this.interestService.seedDefaultInterests();
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<Interest[]> {
    try {
      return await this.interestService.findAll();
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @Get('type')
  async filterByGymRelated(
    @Query('gymRelated') gymRelated: boolean,
  ): Promise<Interest[]> {
    try {
      return await this.interestService.filterByGymRelated(gymRelated);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Interest> {
    try {
      return await this.interestService.findById(id);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInterestDto: Partial<Interest>,
  ): Promise<Interest> {
    try {
      return await this.interestService.update(id, updateInterestDto);
    } catch (e) {
      return ErrorResponse(e);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Interest> {
    try {
      return await this.interestService.delete(id);
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
