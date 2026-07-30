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

async function createAndLoginUser() {
  const email = `list-user-${Date.now()}-${Math.random()}@example.com`;
  const password = '123456';

  await app.inject({
    method: 'POST',
    url: '/users',
    payload: { name: 'List Test User', email, password },
  });

  const loginResponse = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password },
  });

  const { access_token, user } = loginResponse.json();
  return { token: access_token, user };
}

describe('POST /lists (Create)', () => {
  it('creates a new list for the authenticated user', async () => {
    const { token } = await createAndLoginUser();

    const response = await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Weekly Groceries' },
    });

    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.name).toBe('Weekly Groceries');
  });

  it('rejects creating a list without a name', async () => {
    const { token } = await createAndLoginUser();

    const response = await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('rejects creating a list without authentication', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/lists',
      payload: { name: 'No Auth List' },
    });

    expect(response.statusCode).toBe(401);
  });
});

describe('GET /lists (Read - all)', () => {
  it('returns only the lists belonging to the authenticated user', async () => {
    const userA = await createAndLoginUser();
    const userB = await createAndLoginUser();

    await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${userA.token}` },
      payload: { name: 'User A List' },
    });

    await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${userB.token}` },
      payload: { name: 'User B List' },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/lists',
      headers: { authorization: `Bearer ${userA.token}` },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.every((list: any) => list.name !== 'User B List')).toBe(true);
    expect(body.some((list: any) => list.name === 'User A List')).toBe(true);
  });
});

describe('GET /lists/:id (Read - one)', () => {
it('returns a list with its items', async () => {
  const { token } = await createAndLoginUser();

  const createResponse = await app.inject({
    method: 'POST',
    url: '/lists',
    headers: { authorization: `Bearer ${token}` },
    payload: { name: 'List With Items' },
  });

  const list = createResponse.json();

  const response = await app.inject({
    method: 'GET',
    url: `/lists/${list.id}`,
    headers: { authorization: `Bearer ${token}` },
  });

  const body = response.json();

  expect(response.statusCode).toBe(200);
  expect(body.id).toBe(list.id);
  expect(Array.isArray(body.items)).toBe(true);
});

  it('returns 404 for a non-existent list', async () => {
    const { token } = await createAndLoginUser();

    const response = await app.inject({
      method: 'GET',
      url: '/lists/non-existent-id',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(404);
  });
});

describe('PATCH /lists/:id (Update)', () => {
  it('updates the list name', async () => {
    const { token } = await createAndLoginUser();

    const createResponse = await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Old Name' },
    });

    const list = createResponse.json();

    const response = await app.inject({
      method: 'PATCH',
      url: `/lists/${list.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'New Name' },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.name).toBe('New Name');
  });

  it('rejects updating a list the user does not belong to', async () => {
    const owner = await createAndLoginUser();
    const intruder = await createAndLoginUser();

    const createResponse = await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${owner.token}` },
      payload: { name: 'Owner List' },
    });

    const list = createResponse.json();

    const response = await app.inject({
      method: 'PATCH',
      url: `/lists/${list.id}`,
      headers: { authorization: `Bearer ${intruder.token}` },
      payload: { name: 'Hacked Name' },
    });

    expect(response.statusCode).toBe(403);
  });

  it('rejects update without a name', async () => {
    const { token } = await createAndLoginUser();

    const createResponse = await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Some List' },
    });

    const list = createResponse.json();

    const response = await app.inject({
      method: 'PATCH',
      url: `/lists/${list.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('DELETE /lists/:id (Delete)', () => {
  it('deletes a list', async () => {
    const { token } = await createAndLoginUser();

    const createResponse = await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'List To Delete' },
    });

    const list = createResponse.json();

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/lists/${list.id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(deleteResponse.statusCode).toBe(204);

    const check = await prisma.list.findUnique({ where: { id: list.id } });
    expect(check).toBeNull();
  });
});