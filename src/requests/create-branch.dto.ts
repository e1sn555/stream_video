import { IsNotEmpty, Length } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @Length(0, 255)
  address?: string;
}
