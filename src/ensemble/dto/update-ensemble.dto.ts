import { PartialType } from '@nestjs/mapped-types';
import { CreateEnsembleDto } from './create-ensemble.dto';

export class UpdateEnsembleDto extends PartialType(CreateEnsembleDto) {
  name: string;
  description: string;
}
