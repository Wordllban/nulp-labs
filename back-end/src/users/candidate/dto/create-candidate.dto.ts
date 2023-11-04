import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreateCandidateDto extends CreateUserDto {
  @IsOptional()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  experience?: string;
}
