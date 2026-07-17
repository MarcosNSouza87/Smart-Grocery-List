import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../models/prisma';

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    return reply.status(400).send({ error: 'Missing required fields' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return reply.status(409).send({ error: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const { password: _, ...safeUser } = user;
  return reply.status(201).send(safeUser);
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { sub: authenticatedUserId } = request.user as { sub: string };

  if (id !== authenticatedUserId) {
    return reply.status(403).send({ error: 'You can only delete your own account' });
  }

  await prisma.user.delete({ where: { id } });

  return reply.status(204).send();
}