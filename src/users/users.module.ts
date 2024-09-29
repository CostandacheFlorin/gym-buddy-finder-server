import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MatchModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, MatchModule],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
