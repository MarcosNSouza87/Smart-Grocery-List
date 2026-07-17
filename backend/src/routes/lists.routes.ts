import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createList,
  getMyLists,
  getListById,
  deleteList,
} from '../controllers/lists.controllers';

export async function listsRoutes(app: FastifyInstance) {
  app.post('/lists',       { preHandler: authenticate , schema: { tags: ['Lists'] } }, createList );
  app.get('/lists',        { preHandler: authenticate , schema: { tags: ['Lists'] } }, getMyLists );
  app.get('/lists/:id',    { preHandler: authenticate , schema: { tags: ['Lists'] } }, getListById);
  app.delete('/lists/:id', { preHandler: authenticate , schema: { tags: ['Lists'] } }, deleteList );
}