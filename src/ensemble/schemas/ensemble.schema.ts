import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaType, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type MemberRole = 'admin' | 'member';
export type EnsembleDocument = HydratedDocument<Ensemble>;

@Schema()
export class Ensemble {
  @Prop({ required: [true, 'Name is required'] })
  name: string;

  @Prop({ required: [true, 'Description is required'] })
  description: string;

  @Prop({
    type: [
      {
        role: { type: SchemaTypes.String, default: 'member' },
        user: { type: SchemaTypes.ObjectId, ref: 'User' },
      },
    ],
  })
  members: Types.DocumentArray<{ role: MemberRole; user: User }>;
}

export const EnsembleSchema = SchemaFactory.createForClass(Ensemble);
