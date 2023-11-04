import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SearchVacancyByDto } from './dto/search-vacancy-by.dto';
import { Vacancy } from '@prisma/client';

@Injectable()
export class VacancyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVacancyDto: CreateVacancyDto) {
    const { title, description, requirements, recruiterId } = createVacancyDto;
    try {
      const recruiter = await this.prisma.recruiter.findUnique({
        where: {
          id: +recruiterId,
        },
      });

      if (!recruiter) {
        const secondTryResult = await this.prisma.recruiter.findUnique({
          where: {
            id: +recruiterId,
          },
        });

        if (!secondTryResult) {
          throw new ForbiddenException(
            `Cannot find recruiter with id ${recruiterId}.`,
          );
        }
      }

      const vacancy = this.prisma.vacancy.create({
        data: {
          title,
          description,
          requirements,
          recruiterId: +recruiterId,
        },
      });
      return vacancy;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async findAll() {
    try {
      const vacancies = await this.prisma.vacancy.findMany();
      return vacancies;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findOne(id: number) {
    try {
      const vacancy = await this.prisma.vacancy.findUnique({
        where: {
          id,
        },
      });
      return vacancy;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async update(id: number, updateVacancyDto: UpdateVacancyDto) {
    try {
      const vacancy = await this.prisma.vacancy.update({
        where: {
          id,
        },
        data: {
          ...updateVacancyDto,
        },
      });

      return vacancy;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async remove(id: number) {
    try {
      const vacancy = await this.prisma.vacancy.delete({
        where: {
          id,
        },
      });

      return vacancy;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async search(dto: SearchVacancyByDto) {
    const { recruiterId } = dto;
    try {
      const vacancies = await this.prisma.vacancy.findMany({
        where: {
          recruiterId: +recruiterId,
        },
      });

      return vacancies.map((vacancy: Vacancy) => {
        delete vacancy.recruiterId;
        return vacancy;
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }
}
