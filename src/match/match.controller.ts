// src/match/match.controller.ts
import { Controller, Post, Req, Body } from '@nestjs/common';
import { MatchService } from './match.service';
import { Request } from 'express';
import { MatchStatus } from 'types/match';
import { ErrorResponse } from 'utils/errorResponse';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create')
  async createMatch(
    @Body('userId') userId: string,
    @Body('status') status: MatchStatus,
    @Req() req: Request,
  ) {
    try {
      // @ts-expect-error asd
      const user1Id = req.user.id;
      return await this.matchService.createOrUpdateMatch(
        user1Id,
        userId,
        status,
      );
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
