import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../models/prisma';
import { verifyGoogleToken } from '../services/google-auth.service';

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string };

  if (!email || !password) {
    return reply.status(400).send({ error: 'Missing email or password' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if(!user || !user.password) {
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

export async function googleLogin(request: FastifyRequest, reply: FastifyReply) {
  const { idToken } = request.body as { idToken: string };

  if (!idToken) {
    return reply.status(400).send({ error: 'idToken is required' });
  }

  let googlePayload;
  try {
    googlePayload = await verifyGoogleToken(idToken);
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid Google token' });
  }

  const { googleId, email, name, avatarUrl } = googlePayload;

  // Busca por googleId OU email (caso a pessoa já tenha conta criada com senha)
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ googleId }, { email }],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { googleId, email, name, avatarUrl },
    });
  } else if (!user.googleId) {
    // Conta já existia com senha — vincula o Google a ela
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId, avatarUrl },
    });
  }

  const token = request.server.jwt.sign({ sub: user.id, email: user.email });

  return reply.send({
    access_token: token,
    user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  });
}