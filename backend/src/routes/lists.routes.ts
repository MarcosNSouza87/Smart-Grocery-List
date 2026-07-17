import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createList,
  getMyLists,
  getListById,
  deleteList,
} from '../controllers/lists.controller';

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
  }, createList);

  app.get('/lists', { preHandler: authenticate, schema: { tags: ['Lists'] } }, getMyLists);

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
  }, getListById);

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
  }, deleteList);
}