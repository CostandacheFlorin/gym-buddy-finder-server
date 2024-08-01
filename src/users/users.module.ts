import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';
import { MatchModule } from 'src/match/match.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MatchModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, MatchModule],
})
export class UsersModule {}
