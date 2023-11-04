import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInterviewDto: CreateInterviewDto) {
    const { interviewersIds, candidateId, vacancyId, feedback, result } =
      createInterviewDto;

    try {
      const candidate = await this.prisma.candidate.findUnique({
        where: {
          id: +candidateId,
        },
      });

      if (!candidate) {
        const secondTryResult = await this.prisma.candidate.findUnique({
          where: {
            id: +candidateId,
          },
        });
        if (!secondTryResult)
          throw new ForbiddenException(
            `Cannot find candidate with id ${candidateId}`,
          );
      }

      const interview = await this.prisma.interview.create({
        data: {
          candidateId: +candidateId,
          vacancyId: +vacancyId,
          interviewers: {
            connect: interviewersIds.map((id) => ({
              id: +id,
            })),
          },
          feedback,
          result:
            typeof result === 'string'
              ? result === 'true'
                ? true
                : false
              : result,
        },
      });

      return interview;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async findAll() {
    try {
      const interviews = await this.prisma.interview.findMany();
      return interviews;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findOne(id: number) {
    const interview = await this.prisma.interview.findUnique({
      where: {
        id,
      },
    });
    return interview;
  }

  async update(id: number, updateInterviewDto: UpdateInterviewDto) {
    try {
      const interview = await this.prisma.interview.update({
        where: {
          id,
        },
        data: {
          ...updateInterviewDto,
        },
        include: {
          interviewers: true,
        },
      });
      return interview;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async remove(id: number) {
    try {
      const interview = await this.prisma.interview.delete({
        where: {
          id,
        },
      });
      return interview;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
