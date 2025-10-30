import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['TODO', 'IN_PROGRESS', 'DONE'])
  @IsOptional()
  status?: string;

  @IsIn(['LOW', 'MEDIUM', 'HIGH'])
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string;
}