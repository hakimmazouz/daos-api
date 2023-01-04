import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash, hashSync } from 'bcrypt';
import { pick } from 'lodash';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: [true, 'Name is required'] })
  name: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  location: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this['password'] = await hash(this['password'], 10);
  }

  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret, options) => pick(ret, ['_id', 'name', 'email']),
});
