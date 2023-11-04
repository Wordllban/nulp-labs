import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplyToVacancyDto } from './dto/apply-to-vacancy.dto';

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCandidateDto: CreateCandidateDto) {
    const { email, firstName, lastName, hash, type } = createCandidateDto;
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          // TODO: hash password
          hash,
          type,
          candidate: {
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
      const candidates = await this.prisma.candidate.findMany();

      return candidates;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findOne(id: number) {
    try {
      const candidate = await this.prisma.candidate.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });

      return candidate;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async update(id: number, updateCandidateDto: UpdateCandidateDto) {
    try {
      const candidate = await this.prisma.candidate.update({
        where: {
          id,
        },
        data: {
          user: {
            update: {
              ...updateCandidateDto,
            },
          },
        },
        include: {
          user: true,
        },
      });

      return candidate;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async remove(id: number) {
    try {
      const candidate = await this.prisma.candidate.delete({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });

      return candidate;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async applyToVacancy(applyToVacancyDto: ApplyToVacancyDto) {
    const { vacancyId, candidateId } = applyToVacancyDto;
    try {
      const vacancy = await this.prisma.vacancy.findUnique({
        where: {
          id: vacancyId,
        },
      });
      if (!vacancy) throw new ForbiddenException('Vacancy does not exist');

      const candidate = await this.prisma.candidate.findUnique({
        where: {
          id: candidateId,
        },
        include: { applies: true },
      });
      if (!candidate) throw new ForbiddenException('Candidate does not exist');

      candidate.applies.push(vacancy);

      const updateCandidate = await this.prisma.candidate.update({
        where: {
          id: candidateId,
        },
        data: {
          applies: {
            connect: candidate.applies.map((vacancy) => ({ id: vacancy.id })),
          },
        },
      });

      return updateCandidate;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
