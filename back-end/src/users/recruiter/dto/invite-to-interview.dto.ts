import { IsNotEmpty, IsNumber } from 'class-validator';

export class InviteToInterviewDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  interviewers: number[];

  @IsNotEmpty()
  @IsNumber()
  candidateId: number;
}
