import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS liberado pro app mobile conseguir chamar a API
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Smart Grocery List API')
    .setDescription('AI-powered grocery list app — backend API')
    .setVersion('1.0')
    .addBearerAuth() // permite testar rotas autenticadas com JWT no Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();