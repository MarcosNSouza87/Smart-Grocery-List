import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import { createItem, updateItem, deleteItem } from '../controllers/items.controllers';

export async function itemsRoutes(app: FastifyInstance) {
  app.post('/lists/:listId/items', { preHandler: authenticate , schema: { tags: ['Items'] } }, createItem);
  app.patch('/items/:id',          { preHandler: authenticate , schema: { tags: ['Items'] } }, updateItem);
  app.delete('/items/:id',         { preHandler: authenticate , schema: { tags: ['Items'] } }, deleteItem);
}