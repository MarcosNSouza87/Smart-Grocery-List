import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import { createUser, deleteUser } from '../controllers/users.controller';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', {
    schema: {
      tags: ['Users'],
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
  }, createUser);

  app.delete('/users/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, deleteUser);


}