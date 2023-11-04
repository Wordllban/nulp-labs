enum Role {
  RECRUITER = 'RECRUITER',
  CANDIDATE = 'CANDIDATE',
}
export interface IRecruiter {
  id: number;
  userId: number;
  user: {
    createAt: string;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    type: Role;
    updatedAt: string;
  };
}

export interface IVacancy {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  recruiterId: number;
}
