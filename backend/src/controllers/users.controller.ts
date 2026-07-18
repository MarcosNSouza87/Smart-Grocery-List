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

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  await prisma.$transaction(async (tx) => {
    // Lists where this user is the ONLY member get fully deleted (items + list)
    const memberships = await tx.listMember.findMany({
      where: { userId: id },
      include: { list: { include: { members: true } } },
    });

    for (const membership of memberships) {
      const isOnlyMember = membership.list.members.length === 1;

      if (isOnlyMember) {
        await tx.item.deleteMany({ where: { listId: membership.listId } });
        await tx.listMember.deleteMany({ where: { listId: membership.listId } });
        await tx.list.delete({ where: { id: membership.listId } });
      } else {
        // Shared list — just remove this user's membership, keep the list intact
        await tx.listMember.delete({ where: { id: membership.id } });
      }
    }

    await tx.historyItem.deleteMany({ where: { userId: id } });
    await tx.user.delete({ where: { id } });
  });

  return reply.status(204).send();
}