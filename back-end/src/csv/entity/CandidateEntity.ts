import { Role } from '@prisma/client';

export class CandidateEntity {
  email: string = '';
  hash: string = '';
  firstName: string = '';
  lastName: string = '';
  type: Role = Role.CANDIDATE;
}
