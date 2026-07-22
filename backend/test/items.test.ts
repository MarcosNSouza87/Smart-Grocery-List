import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';
import { prisma } from '../src/models/prisma';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

async function createUserWithList() {
  const email = `item-user-${Date.now()}-${Math.random()}@example.com`;
  const password = '123456';

  await app.inject({
    method: 'POST',
    url: '/users',
    payload: { name: 'Item Test User', email, password },
  });

  const loginResponse = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password },
  });

  const { access_token } = loginResponse.json();

  const listResponse = await app.inject({
    method: 'POST',
    url: '/lists',
    headers: { authorization: `Bearer ${access_token}` },
    payload: { name: 'List for Items' },
  });

  const list = listResponse.json();

  return { token: access_token, listId: list.id };
}

describe('POST /lists/:listId/items (Create)', () => {
  it('adds an item to a list', async () => {
    const { token, listId } = await createUserWithList();

    const response = await app.inject({
      method: 'POST',
      url: `/lists/${listId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Rice', category: 'Grains', quantity: 2, unit: 'kg' },
    });

    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.name).toBe('Rice');
    expect(body.quantity).toBe(2);
    expect(body.isPurchased).toBe(false);
  });

  it('defaults quantity to 1 when not provided', async () => {
    const { token, listId } = await createUserWithList();

    const response = await app.inject({
      method: 'POST',
      url: `/lists/${listId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Milk' },
    });

    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.quantity).toBe(1);
  });

  it('rejects an item without a name', async () => {
    const { token, listId } = await createUserWithList();

    const response = await app.inject({
      method: 'POST',
      url: `/lists/${listId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { category: 'Misc' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('rejects request without authentication', async () => {
    const { listId } = await createUserWithList();

    const response = await app.inject({
      method: 'POST',
      url: `/lists/${listId}/items`,
      payload: { name: 'Beans' },
    });

    expect(response.statusCode).toBe(401);
  });
});

describe('PATCH /items/:id (Update)', () => {
  it('marks an item as purchased', async () => {
    const { token, listId } = await createUserWithList();

    const createResponse = await app.inject({
      method: 'POST',
      url: `/lists/${listId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Beans' },
    });

    const item = createResponse.json();

    const response = await app.inject({
      method: 'PATCH',
      url: `/items/${item.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { isPurchased: true },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.isPurchased).toBe(true);
  });

  it('updates item quantity', async () => {
    const { token, listId } = await createUserWithList();

    const createResponse = await app.inject({
      method: 'POST',
      url: `/lists/${listId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Pasta', quantity: 1 },
    });

    const item = createResponse.json();

    const response = await app.inject({
      method: 'PATCH',
      url: `/items/${item.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { quantity: 5 },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.quantity).toBe(5);
  });
});

describe('DELETE /items/:id (Delete)', () => {
  it('deletes an item', async () => {
    const { token, listId } = await createUserWithList();

    const createResponse = await app.inject({
      method: 'POST',
      url: `/lists/${listId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Tomato Sauce' },
    });

    const item = createResponse.json();

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/items/${item.id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(deleteResponse.statusCode).toBe(204);

    const check = await prisma.item.findUnique({ where: { id: item.id } });
    expect(check).toBeNull();
  });
});