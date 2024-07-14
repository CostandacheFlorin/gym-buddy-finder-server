import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InterestService } from './interest/interest.service';
import { InterestController } from './interest/interest.controller';
import { InterestSchema } from './schemas/interest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Interest', schema: InterestSchema }]),
  ],
  providers: [InterestService],
  controllers: [InterestController],
})
export class InterestsModule {}
