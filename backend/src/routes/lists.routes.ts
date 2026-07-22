import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import * as L from '../controllers/lists.controller';

export async function listsRoutes(app: FastifyInstance) {
  app.post('/lists', {
    preHandler: authenticate,
    schema: {
      tags: ['Lists'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
    },
  }, L.createList);

  app.get('/lists', { preHandler: authenticate, schema: { tags: ['Lists'] } }, L.getMyLists);

  app.get('/lists/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Lists'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, L.getListById);

  // dentro de listsRoutes:
app.patch('/lists/:id', {
  preHandler: authenticate,
  schema: {
    tags: ['Lists'],
    security: [{ bearerAuth: [] }],
    params: { type: 'object', properties: { id: { type: 'string' } } },
    body: {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string' } },
    },
  },
}, L.updateList);

  app.delete('/lists/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Lists'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, L.deleteList);
}