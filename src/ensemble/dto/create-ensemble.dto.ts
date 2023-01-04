import { IsNotEmpty } from 'class-validator';

export class CreateEnsembleDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}
