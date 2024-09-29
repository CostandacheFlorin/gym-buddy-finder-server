import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Picture } from 'src/types/user';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  gymRelatedInterests: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  nonGymRelatedInterests: string[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  pictures: Picture[];
}
