import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../models/prisma';

export async function createItem(request: FastifyRequest, reply: FastifyReply) {
  const { listId } = request.params as { listId: string };
  const { name, category, quantity, unit } = request.body as {
    name: string;
    category?: string;
    quantity?: number;
    unit?: string;
  };

  if (!name) {
    return reply.status(400).send({ error: 'Name is required' });
  }

  const item = await prisma.item.create({
    data: { name, category, quantity: quantity ?? 1, unit, listId },
  });

  return reply.status(201).send(item);
}

export async function updateItem(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const data = request.body as Partial<{
    name: string;
    category: string;
    quantity: number;
    unit: string;
    isPurchased: boolean;
  }>;

  const item = await prisma.item.update({
    where: { id },
    data,
  });

  return reply.send(item);
}

export async function deleteItem(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  await prisma.item.delete({ where: { id } });

  return reply.status(204).send();
}