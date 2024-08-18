import { IsNotEmpty, IsString, IsEnum, IsMongoId } from 'class-validator';
import { MessageStatus } from 'src/messages/types';

export class CreateMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly sender: string; // ID of the user sending the message

  @IsMongoId()
  @IsNotEmpty()
  readonly receiver: string; // ID of the user receiving the message

  @IsString()
  @IsNotEmpty()
  readonly content: string; // The content of the message

  @IsEnum(MessageStatus)
  readonly status?: MessageStatus;
}
