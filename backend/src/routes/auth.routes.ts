import { FastifyInstance } from 'fastify';
import { login, googleLogin } from '../controllers/auth.controller';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  }, login);

  app.post('/auth/google', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['idToken'],
        properties: {
          idToken: { type: 'string' },
        },
      },
    },
  }, googleLogin);
}