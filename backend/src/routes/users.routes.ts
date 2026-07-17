import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import { createUser, deleteUser } from '../controllers/users.controller';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', { schema: { tags: ['Users'] } }, createUser);
  app.delete('/users/:id', { preHandler: authenticate, schema: { tags: ['Users'] } }, deleteUser);
}