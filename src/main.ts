import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV, ENVIRONMENT_VARIABLES } from '@libs/common';
import { AppModule } from '@api/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  const logger = new Logger();

  const configService = app.get(ConfigService<ENVIRONMENT_VARIABLES>);

  const PORT = configService.get<number>(ENV.APP_PORT) || 3000;

  await app.listen(PORT, () => {
    logger.log(`Server started at localhost:${PORT}`);
    logger.log(`GraphQL URL localhost:${PORT}/graphql'}`);
  });
}

bootstrap();
