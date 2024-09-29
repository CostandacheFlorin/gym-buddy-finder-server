import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { MessageStatus } from '../../types';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string; // The updated content of the message

  @IsEnum(MessageStatus)
  readonly status?: MessageStatus; // The updated status of the message (optional)
}
