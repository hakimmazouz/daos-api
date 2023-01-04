import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { UpdateEnsembleDto } from './dto/update-ensemble.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApplyUser } from 'src/auth/guards/apply-user.guard';
import { CurrentUser } from 'src/decorators/CurrentUser.decorator';
import { User } from 'src/users/schemas/user.schema';

@Controller('ensembles')
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEnsembleDto: CreateEnsembleDto, @CurrentUser() user) {
    return this.ensembleService.create(user, createEnsembleDto);
  }

  @Get()
  findAll() {
    return this.ensembleService.findAll();
  }

  @Get(':id')
  @UseGuards(ApplyUser)
  async findOne(@Param('id') id: string, @CurrentUser() user) {
    const ensemble = await (await this.ensembleService.findOne(id)).toJSON();

    return {
      ...ensemble,
      membership: ensemble.members.find((m) => m.user.email == user.email),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnsembleDto: UpdateEnsembleDto,
    @Request() req,
  ) {
    return this.ensembleService.update(id, updateEnsembleDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Request() req) {
    return this.ensembleService.remove(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @Request() req) {
    return this.ensembleService.join(id, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @Request() req) {
    return this.ensembleService.leave(id, req.user);
  }
}
