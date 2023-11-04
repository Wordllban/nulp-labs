import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateVacancyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString({ each: true })
  requirements: string[];

  @IsNotEmpty()
  @IsNumber()
  recruiterId: number;
}
