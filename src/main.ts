import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      //no está whitelist: true, lo que permite que se puedan agregar maas campos de los que se piden
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
