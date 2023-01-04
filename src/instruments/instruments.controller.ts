import { Controller, Get } from '@nestjs/common';

@Controller('instruments')
export class InstrumentsController {
  @Get()
  async findAll() {
    return {
      data: [{ id: 1, name: 'Guitar', icon: 'guitar' }],
    };
  }
}
