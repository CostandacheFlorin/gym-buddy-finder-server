// src/match/match.controller.ts
import { Controller, Post, Req, Body } from '@nestjs/common';
import { MatchService } from './match.service';
import { Request } from 'express';
import { MatchStatus } from 'types/match';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create')
  async createMatch(
    @Body('userId') userId: string,
    @Body('status') status: MatchStatus,
    @Req() req: Request,
  ) {
    // @ts-expect-error asd
    const user1Id = req.user.id; // Assuming you have a user object in your request
    return this.matchService.createOrUpdateMatch(user1Id, userId, status);
  }
}
