// src/match/match.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchStatus } from 'types/match';
import { ErrorResponse } from 'utils/errorResponse';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('match')
  async startMatching(
    @Body('target_user_id') target_user_id: string,
    @Body('status') status: MatchStatus,
  ) {
    try {
      // const user1Id = req.user.id;
      // const user_id = '66ae45220b2f82241888d309';
      const user_id = '66ae3728c9e8cc32a37869e1';

      return await this.matchService.createOrUpdateMatch(
        user_id,
        target_user_id,
        status,
      );
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
