import { Module } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { InterviewModule } from '../../interview/interview.module';

@Module({
  controllers: [RecruiterController],
  providers: [RecruiterService],
  exports: [RecruiterService],
  imports: [InterviewModule],
})
export class RecruiterModule {}
