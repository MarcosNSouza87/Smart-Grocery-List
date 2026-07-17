import { FastifyInstance } from 'fastify';
import { createUser } from '../controllers/users.controller';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', createUser);
}