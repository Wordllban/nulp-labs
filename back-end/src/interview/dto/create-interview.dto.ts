import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateInterviewDto {
  @IsNumber({}, { each: true })
  interviewersIds: number[];

  @IsNumber()
  candidateId: number;

  @IsNumber()
  vacancyId: number;

  @IsOptional()
  @IsNumber()
  result?: boolean;

  @IsOptional()
  @IsString()
  feedback?: string;
}
