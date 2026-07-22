import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../models/prisma';

interface AuthPayload {
  sub: string;
  email: string;
}

export async function createList(request: FastifyRequest, reply: FastifyReply) {
  const { name } = request.body as { name: string };
  const { sub: userId } = request.user as AuthPayload;

  if (!name) {
    return reply.status(400).send({ error: 'Name is required' });
  }

  const list = await prisma.list.create({
    data: {
      name,
      members: {
        create: { userId },
      },
    },
  });

  return reply.status(201).send(list);
}

export async function getMyLists(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as AuthPayload;

  const lists = await prisma.list.findMany({
    where: { members: { some: { userId } } },
    include: { items: true },
  });

  return reply.send(lists);
}

export async function getListById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const list = await prisma.list.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!list) {
    return reply.status(404).send({ error: 'List not found' });
  }

  return reply.send(list);
}

export async function updateList(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { sub: userId } = request.user as AuthPayload;
  const { name } = request.body as { name?: string };

  if (!name) {
    return reply.status(400).send({ error: 'Name is required' });
  }

  const membership = await prisma.listMember.findUnique({
    where: { userId_listId: { userId, listId: id } },
  });

  if (!membership) {
    return reply.status(403).send({ error: 'You do not have access to this list' });
  }

  const list = await prisma.list.update({
    where: { id },
    data: { name },
  });

  return reply.send(list);
}

export async function deleteList(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  await prisma.item.deleteMany({ where: { listId: id } });
  await prisma.listMember.deleteMany({ where: { listId: id } });
  await prisma.list.delete({ where: { id } });

  return reply.status(204).send();
}