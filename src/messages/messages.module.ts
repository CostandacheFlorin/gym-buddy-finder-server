import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageSchema } from './schemas/message.schema';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../auth/auth.module';
import { MatchModule } from '../match/match.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    AuthModule,
    MatchModule,
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
