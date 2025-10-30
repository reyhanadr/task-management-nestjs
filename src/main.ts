// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const PORT = 3001;
  await app.listen(PORT);

  console.log(`HTTP server running on http://localhost:${PORT}`);
  console.log(`WebSocket server ready at ws://localhost:${PORT}/events`);
}
bootstrap();