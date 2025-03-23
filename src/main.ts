import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app.module';
import { ConfigService } from '@nestjs/config';
import { FullConfig } from './infrastructure/config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<FullConfig>>(ConfigService);

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('SERVICE_NAME') || 'swagger-title')
    .setDescription('apm swagger')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: configService.get('ACCESS_JWT_HEADER_NAME'),
      },
      configService.get('ACCESS_JWT_HEADER_NAME'),
    )
    .addBearerAuth(
      {
        type: 'apiKey',
        in: 'header',
        name: configService.get('REFRESH_JWT_HEADER_NAME'),
      },
      configService.get('REFRESH_JWT_HEADER_NAME'),
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = configService.get<number>('PORT');
  if (!port) {
    throw new Error('PORT is not defined in the configuration');
  }
  await app.listen(port);
}
bootstrap();
