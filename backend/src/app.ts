import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';

import { usersRoutes } from './routes/users.routes';
import { authRoutes } from './routes/auth.routes';
import { listsRoutes } from './routes/lists.routes';
import { itemsRoutes } from './routes/items.routes';

export async function buildApp() {
  const app = Fastify({ logger: false });

  await app.register(cors, { origin: '*' });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'default_secret',
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Smart Grocery List API',
        description: 'AI-powered grocery list app — backend API',
        version: '1.0.0',
      },
      tags: [
        { name: 'Auth', description: 'Login and authentication' },
        { name: 'Users', description: 'User registration and management' },
        { name: 'Lists', description: 'Shopping lists' },
        { name: 'Items', description: 'Items within a shopping list' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  });

  await app.register(swaggerUi, { routePrefix: '/api-docs' });

  app.get('/health', { schema: { hide: true } }, async () => {
    return { status: 'ok', service: 'smart-grocery-list-api' };
  });

  await app.register(usersRoutes);
  await app.register(authRoutes);
  await app.register(listsRoutes);
  await app.register(itemsRoutes);

  return app;
}