import { FastifyInstance } from 'fastify';
import { login, googleLogin } from '../controllers/auth.controller';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', { schema: { tags: ['Auth'] } }, login);
  app.post('/auth/google', { schema: { tags: ['Auth'] } }, googleLogin);
}