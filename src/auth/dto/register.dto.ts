import {
  IsString,
  IsNotEmpty,
  IsEnum,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';
import { Gender } from '../../types/user';
import { IsValidAge } from '../../validators/birthday';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  password: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsValidAge()
  birth_date: Date;
}
