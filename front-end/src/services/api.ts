import axios from 'axios';
import { IRecruiter, IVacancy } from '../types/responses';

export const http = axios.create({
  baseURL: 'http://localhost:8000/',
});

export const requestRecruiters = async () => {
  const result: IRecruiter[] = (await http.get('/recruiter')).data;
  return result;
};

export const requestVacanciesByRecruiterId = async (
  recruiterId: string | number,
) => {
  const result: IVacancy[] = (
    await http.get(`/vacancy/search?recruiterId=${recruiterId}`)
  ).data;
  return result;
};

export const handleDeleteVacancy = async (vacancyId: string | number) => {
  const result = (await http.delete(`/vacancy/${vacancyId}`)).data;
  return result;
};

export const requestVacancyCreation = async (vacancy: Omit<IVacancy, 'id'>) => {
  const result = (
    await http.post('/vacancy', {
      data: {
        title: vacancy.title,
        description: vacancy.description,
        requirements: vacancy.requirements,
        recruiterId: vacancy.recruiterId,
      },
    })
  ).data;
  return result;
};

export const requestVacancyEdit = async (
  data: Omit<IVacancy, 'recruiterId'>,
) => {
  const result: IVacancy[] = (
    await http.patch(`/vacancy/${data.id}`, {
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
      },
    })
  ).data;
  return result;
};
