import { Module } from '@nestjs/common';
import { CSVService } from './csv.service';
import { InterviewModule } from '../interview/interview.module';
import { CandidateModule } from '../users/candidate/candidate.module';
import { RecruiterModule } from '../users/recruiter/recruiter.module';
import { VacancyModule } from '../vacancy/vacancy.module';
import { CSVController } from './csv.controller';

@Module({
  controllers: [CSVController],
  providers: [CSVService],
  imports: [InterviewModule, CandidateModule, RecruiterModule, VacancyModule],
})
export class CSVModule {}
