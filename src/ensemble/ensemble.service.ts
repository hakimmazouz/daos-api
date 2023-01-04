import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { UpdateEnsembleDto } from './dto/update-ensemble.dto';
import { Ensemble, EnsembleDocument } from './schemas/ensemble.schema';
import { pick } from 'lodash';

@Injectable()
export class EnsembleService {
  constructor(
    @InjectModel(Ensemble.name) private ensembleModel: Model<EnsembleDocument>,
  ) {}

  async create(user: User, createEnsembleDto: CreateEnsembleDto) {
    const ensemble = new this.ensembleModel({
      ...createEnsembleDto,
      members: { user, role: 'admin' },
    });

    await ensemble.save();

    return ensemble;
  }

  findAll() {
    return this.ensembleModel.find();
  }

  async findOne(id: string, user?: User) {
    try {
      const ensemble = await await (
        await this.ensembleModel.findById(id)
      ).populate({
        path: 'members',
        populate: 'user',
      });
      if (!ensemble)
        throw new NotFoundException({ error: 'No ensemble found' });

      return ensemble;
    } catch (e) {
      throw new NotFoundException({ error: 'No ensemble found' });
    }
  }

  async update(id: string, updateEnsembleDto: UpdateEnsembleDto, user: User) {
    const ensemble = await await (
      await this.findOne(id)
    ).populate({ path: 'members', populate: 'user' });

    if (!ensemble)
      throw new NotFoundException({ error: 'No ensemble with id ' + id });

    if (
      !ensemble.members.some(
        (m) => m.user.email == user.email && m.role == 'admin',
      )
    )
      throw new UnauthorizedException({
        error: 'You do not have permission to edit this ensemble',
      });

    ensemble.set(updateEnsembleDto);
    await ensemble.save();

    return ensemble;
  }

  async remove(id: string, user: User) {
    const ensemble = await (
      await this.findOne(id)
    ).populate({ path: 'members', populate: 'user' });

    const admin = ensemble.members.find(
      (m) => m.user.email == user.email && m.role == 'admin',
    );

    if (!admin)
      throw new UnauthorizedException({
        error: 'No permission to delete this ensemble',
      });

    await ensemble.remove();
  }

  async join(id: string, user: User) {
    const ensemble = await (
      await this.findOne(id)
    ).populate({ path: 'members', populate: 'user' });
    console.log(ensemble.members);

    if (ensemble.members.some((m) => m.user?.email == user.email)) {
      throw new BadRequestException({ error: 'User is already a member' });
    }

    ensemble.members.push({ user });
    await ensemble.save();

    await ensemble.populate('members');

    return ensemble;
  }

  async leave(id: string, user: User) {
    const ensemble = await (
      await this.findOne(id)
    ).populate({ path: 'members', populate: 'user' });

    if (!ensemble.members.some((m) => m.user.email == user.email))
      throw new BadRequestException({ error: 'User is not a member' });

    const membership = ensemble.members.find((m) => m.user.email == user.email);

    ensemble.members.pull(membership);
    await ensemble.save();

    return ensemble;
  }
}
