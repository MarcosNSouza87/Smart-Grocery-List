import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';

//import routes
import { usersRoutes } from './routes/users.routes';
import { authRoutes } from './routes/auth.routes';
import { listsRoutes } from './routes/lists.routes';
import { itemsRoutes } from './routes/items.routes';

const app = Fastify({ logger: true });

async function main() {
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
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/api-docs',
  });

  // app.get('/health', async () => {
  //   return { status: 'ok', service: 'smart-grocery-list-api' };
  // });

  //register routes
  await app.register(usersRoutes);
  await app.register(authRoutes);
  await app.register(listsRoutes);
  await app.register(itemsRoutes);

  const port = Number(process.env.PORT) || 3000;
  await app.listen({ port, host: '0.0.0.0' });
}

main().catch((err) => {
  app.log.error(err);
  process.exit(1);
});