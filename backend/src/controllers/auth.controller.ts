import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../models/prisma';

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string };

  if (!email || !password) {
    return reply.status(400).send({ error: 'Missing email or password' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  const token = request.server.jwt.sign({ sub: user.id, email: user.email });

  return reply.send({
    access_token: token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}