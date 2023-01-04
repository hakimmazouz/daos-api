import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory(errors: ValidationError[]) {
        console.log(errors);
        const formatted = errors.reduce((total, current: ValidationError) => {
          total[current.property] = Object.values(current.constraints);
          return total;
        }, {});
        return new UnprocessableEntityException({ errors: formatted });
      },
    }),
  );
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
