import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  API_DESCRIPTION,
  API_TITLE,
  CRON_API_DESCRIPTION,
  CRON_API_TAG,
  HEALTH_API_DESCRIPTION,
  HEALTH_API_TAG,
  METADATA_API_DESCRIPTION,
  METADATA_API_TAG,
  SWAGGER_PATH,
} from './assets/swagger.constants';
import { RuntimeService } from './metadata/services/runtime.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Configure logger
    logger: ['log', 'error', 'warn'], // Missing: 'verbose', 'debug'
  });

  const runtimeService: RuntimeService = app.get(RuntimeService);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .setVersion(runtimeService.appVersion)
    .addTag(CRON_API_TAG, CRON_API_DESCRIPTION)
    .addTag(METADATA_API_TAG, METADATA_API_DESCRIPTION)
    .addTag(HEALTH_API_TAG, HEALTH_API_DESCRIPTION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);

  await app.listen(3000);
}
bootstrap();
