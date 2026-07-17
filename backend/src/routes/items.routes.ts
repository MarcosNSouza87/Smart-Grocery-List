import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import { createItem, updateItem, deleteItem } from '../controllers/items.controller';

export async function itemsRoutes(app: FastifyInstance) {
  app.post('/lists/:listId/items', {
    preHandler: authenticate,
    schema: {
      tags: ['Items'],
      params: {
        type: 'object',
        properties: { listId: { type: 'string' } },
      },
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          category: { type: 'string' },
          quantity: { type: 'number' },
          unit: { type: 'string' },
        },
      },
    },
  }, createItem);

  app.patch('/items/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Items'],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          category: { type: 'string' },
          quantity: { type: 'number' },
          unit: { type: 'string' },
          isPurchased: { type: 'boolean' },
        },
      },
    },
  }, updateItem);

  app.delete('/items/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Items'],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, deleteItem);
}