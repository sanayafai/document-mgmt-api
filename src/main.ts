import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Optional: if you have a global prefix, e.g. 'api'
  // app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);

  // Make sure the path here matches the URL you are visiting:
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
