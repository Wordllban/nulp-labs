import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InterviewService } from '../interview/interview.service';
import { CandidateService } from '../users/candidate/candidate.service';
import { RecruiterService } from '../users/recruiter/recruiter.service';
import { VacancyService } from '../vacancy/vacancy.service';
import { writeFile, createReadStream } from 'fs';
import { Role } from '@prisma/client';
import { asyncStream, generateCsvData, mergeMultipleCsvStrings } from './utils';
import {
  RecruiterEntity,
  VacancyEntity,
  CandidateEntity,
  InterviewEntity,
} from './entity';

const RECRUITERS_NUMBER: number = 50 as const;
const CANDIDATES_NUMBER: number = 500 as const;
const VACANCIES_NUMBER: number = 150 as const;
const INTERVIEWS_NUMBER: number = 300 as const;

@Injectable()
export class CSVService {
  parsedData: string[][];

  constructor(
    private readonly vacancy: VacancyService,
    private readonly interview: InterviewService,
    private readonly candidate: CandidateService,
    private readonly recruiter: RecruiterService,
  ) {}

  parseCSV(csvString: string) {
    const lines = csvString.trim().split('\r\n');
    const headers = lines.shift().split(',');
    const result = [];

    for (const line of lines) {
      const values = line.split(',');
      const obj = {};

      for (let i = 0; i < headers.length; i++) {
        const value = values[i];
        // edge case if value is array
        if (['[', ']'].some((condition) => value.includes(condition))) {
          const multipleValues = value.replace(/\[|\]|"|'/g, '');
          obj[headers[i]] = multipleValues.split(' ');
        } else {
          obj[headers[i]] = values[i];
        }
      }

      result.push(obj);
    }

    return result;
  }

  write() {
    try {
      const recruiterData = generateCsvData(
        Object.getOwnPropertyNames(new RecruiterEntity()),
        RECRUITERS_NUMBER,
        [
          {
            customKeyName: 'type',
            customKeyValue: () => Role.RECRUITER,
          },
        ],
      );
      const vacancyData = generateCsvData(
        Object.getOwnPropertyNames(new VacancyEntity()),
        VACANCIES_NUMBER,
        [
          {
            customKeyName: 'requirements',
            customKeyValue: () => {
              return (
                '["' + (Math.random() + 1).toString(36).substring(7) + '"]'
              );
            },
          },
          {
            customKeyName: 'recruiterId',
            customKeyValue: () => {
              return Math.floor(Math.random() * RECRUITERS_NUMBER + 1);
            },
          },
        ],
      );
      const candidateData = generateCsvData(
        Object.getOwnPropertyNames(new CandidateEntity()),
        CANDIDATES_NUMBER,
        [
          {
            customKeyName: 'type',
            customKeyValue: () => Role.CANDIDATE,
          },
        ],
      );
      const interviewData = generateCsvData(
        Object.getOwnPropertyNames(new InterviewEntity()),
        INTERVIEWS_NUMBER,
        [
          {
            customKeyName: 'interviewersIds',
            customKeyValue: () => {
              return `[${Math.floor(Math.random() * RECRUITERS_NUMBER + 1)}]`;
            },
          },
          {
            customKeyName: 'candidateId',
            customKeyValue: () => {
              return Math.floor(Math.random() * CANDIDATES_NUMBER + 1);
            },
          },
          {
            customKeyName: 'vacancyId',
            customKeyValue: () => {
              return Math.floor(Math.random() * VACANCIES_NUMBER + 1);
            },
          },
          {
            customKeyName: 'result',
            customKeyValue: () => {
              return Math.random() >= 0.9 ? true : false;
            },
          },
        ],
      );

      const data = mergeMultipleCsvStrings([
        recruiterData,
        vacancyData,
        candidateData,
        interviewData,
      ]);

      return writeFile(`${__dirname}/data.csv`, data, (error) => {
        if (error) {
          console.error(error);
          throw new UnprocessableEntityException(error);
        }
      });
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error);
    }
  }

  async read() {
    try {
      const readStream = createReadStream(`${__dirname}/data.csv`);

      const result = await asyncStream(readStream, this.parseCSV);

      return result;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error);
    }
  }

  async pushToDB() {
    try {
      const result = await this.read();

      // recruiter
      await result[0].forEach((recruiter: RecruiterEntity) => {
        return this.recruiter.create(recruiter);
      });

      // vacancy
      await result[1].forEach((vacancy: VacancyEntity) => {
        return this.vacancy.create(vacancy);
      });

      // candidate
      await result[2].forEach((candidate: CandidateEntity) => {
        return this.candidate.create(candidate);
      });

      // interview
      await result[3].forEach((interview: InterviewEntity) => {
        return this.interview.create(interview);
      });

      return 'Changes pushed to Database';
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error);
    }
  }
}
