import { Role } from '@prisma/client';

export class RecruiterEntity {
  email: string = '';
  hash: string = '';
  firstName: string = '';
  lastName: string = '';
  type: Role = Role.RECRUITER;
}
