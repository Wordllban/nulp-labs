import { IsString } from 'class-validator';

export class SearchVacancyByDto {
  @IsString()
  recruiterId: string;
}
