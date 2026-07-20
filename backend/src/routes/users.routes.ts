import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import { createUser, getMe, updateUser, deleteUser } from '../controllers/users.controller';

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

  app.get('/users/me', {
    preHandler: authenticate,
    schema: { tags: ['Users'], security: [{ bearerAuth: [] }] },
  }, getMe);

  app.patch('/users/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', properties: { id: { type: 'string' } } },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
    },
  }, updateUser);

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