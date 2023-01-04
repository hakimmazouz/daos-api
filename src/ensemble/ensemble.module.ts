import { Module } from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { EnsembleController } from './ensemble.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ensemble, EnsembleSchema } from './schemas/ensemble.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ensemble.name, schema: EnsembleSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Ensemble.name, schema: EnsembleSchema },
    ]),
  ],
  controllers: [EnsembleController],
  providers: [EnsembleService],
})
export class EnsembleModule {}
