import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchStatus } from '../types/match';
import { ErrorResponse } from 'src/utils/errorResponse';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @UseGuards(AuthGuard)
  @Post('match')
  async startMatching(
    @Body('target_user_id') target_user_id: string,
    @Body('status') status: MatchStatus,
    @Request() req,
  ) {
    try {
      return await this.matchService.createOrUpdateMatch(
        req.user.id,
        target_user_id,
        status,
      );
    } catch (e) {
      return ErrorResponse(e);
    }
  }
}
