import {
  IsString,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Gender } from 'src/types/user';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsDateString()
  birth_date: string;

  @IsEmail()
  email: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}
