import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InterestService } from './interest/interest.service';
import { InterestController } from './interest/interest.controller';
import { InterestSchema } from './schemas/interest.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Interest', schema: InterestSchema }]),
    AuthModule,
  ],
  providers: [InterestService],
  controllers: [InterestController],
})
export class InterestsModule {}
