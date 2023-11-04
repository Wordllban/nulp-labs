import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInterviewDto } from '../../interview/dto/create-interview.dto';
import { InterviewService } from '../../interview/interview.service';

@Injectable()
export class RecruiterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly interview: InterviewService,
  ) {}

  makeInterview(dto: CreateInterviewDto) {
    return this.interview.create(dto);
  }

  async create(createRecruiterDto: CreateRecruiterDto) {
    const { email, firstName, lastName, hash, type } = createRecruiterDto;
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          // TODO: hash password
          hash,
          type,
          recruiter: {
            create: {},
          },
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      throw new UnprocessableEntityException(error);
    }
  }

  async findAll() {
    try {
      const recruiters = await this.prisma.recruiter.findMany({
        include: {
          user: true,
        },
      });
      return recruiters;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findOne(id: number) {
    try {
      const recruiter = await this.prisma.recruiter.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });

      if (!recruiter) {
        throw new ForbiddenException(`Recruiter with ${id} not found.`);
      }

      return recruiter;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async update(id: number, updateRecruiterDto: UpdateRecruiterDto) {
    try {
      const recruiter = await this.prisma.recruiter.update({
        where: {
          id,
        },
        data: {
          user: {
            update: {
              ...updateRecruiterDto,
            },
          },
        },
        include: {
          user: true,
        },
      });
      return recruiter;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async remove(id: number) {
    try {
      const recruiter = await this.prisma.recruiter.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });

      if (!recruiter) {
        throw new ForbiddenException(`Recruiter with id ${id} does not exist.`);
      }
      const user = await this.prisma.user.delete({
        where: {
          id: recruiter.userId,
        },
      });
      return user;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
