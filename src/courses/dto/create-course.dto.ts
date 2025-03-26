
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsString()
  instructor: string;

  @IsUrl()
  @IsOptional()
  instructorImage?: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNumber()
  @IsOptional()
  reviews?: number;

  @IsNumber()
  @IsOptional()
  students?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsNumber()
  @IsOptional()
  lessons?: number;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;
}