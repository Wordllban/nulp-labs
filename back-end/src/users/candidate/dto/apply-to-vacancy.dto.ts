import { IsOptional, IsNumber } from 'class-validator';

export class ApplyToVacancyDto {
  @IsOptional()
  @IsNumber()
  vacancyId: number;

  @IsOptional()
  @IsNumber()
  candidateId: number;
}
