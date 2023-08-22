import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsArray()
  branches: string[];

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;
}
