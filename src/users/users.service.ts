import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new BadRequestException({
        errors: {
          email: ['Email already in use'],
        },
      });
    }

    const createdUser = new this.userModel(createUserDto);
    try {
      await createdUser.save();
      return createdUser;
    } catch (e) {
      throw new BadRequestException({ errors: e.errors });
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(filter: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(filter);
  }
}
