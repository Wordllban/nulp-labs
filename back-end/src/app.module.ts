import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RecruiterModule } from './users/recruiter/recruiter.module';
import { CandidateModule } from './users/candidate/candidate.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { InterviewModule } from './interview/interview.module';
import { CSVModule } from './csv/csv.module';

@Module({
  imports: [
    PrismaModule,
    RecruiterModule,
    CandidateModule,
    VacancyModule,
    InterviewModule,
    CSVModule,
  ],
})
export class AppModule {}
