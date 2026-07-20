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

// Helper: cria um usuário e já faz login, retornando token + dados
async function createAndLoginUser() {
  const email = `user-${Date.now()}-${Math.random()}@example.com`;
  const password = '123456';

  const createResponse = await app.inject({
    method: 'POST',
    url: '/users',
    payload: { name: 'CRUD Test User', email, password },
  });

  const loginResponse = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password },
  });

  const { access_token, user } = loginResponse.json();

  return { token: access_token, user, email, createResponse };
}

describe('POST /users (Create)', () => {
  it('creates a new user and hides the password in the response', async () => {
    const email = `test-${Date.now()}@example.com`;

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'Test User', email, password: '123456' },
    });

    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.email).toBe(email);
    expect(body.password).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const email = `dup-${Date.now()}@example.com`;

    await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'User One', email, password: '123456' },
    });

    const secondResponse = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'User Two', email, password: '654321' },
    });

    expect(secondResponse.statusCode).toBe(409);
  });

  it('rejects missing required fields', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { email: 'incomplete@example.com' },
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('GET /users/me (Read)', () => {
  it('returns the authenticated user profile', async () => {
    const { token, email } = await createAndLoginUser();

    const response = await app.inject({
      method: 'GET',
      url: '/users/me',
      headers: { authorization: `Bearer ${token}` },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.email).toBe(email);
    expect(body.password).toBeUndefined();
  });

  it('rejects request without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/me',
    });

    expect(response.statusCode).toBe(401);
  });
});

describe('PATCH /users/:id (Update)', () => {
  it('updates the user own name', async () => {
    const { token, user } = await createAndLoginUser();

    const response = await app.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Updated Name' },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.name).toBe('Updated Name');
  });

  it('rejects updating another user account', async () => {
    const { token } = await createAndLoginUser();
    const otherUser = await createAndLoginUser();

    const response = await app.inject({
      method: 'PATCH',
      url: `/users/${otherUser.user.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Hacked Name' },
    });

    expect(response.statusCode).toBe(403);
  });

  it('rejects email already in use by another account', async () => {
    const first = await createAndLoginUser();
    const second = await createAndLoginUser();

    const response = await app.inject({
      method: 'PATCH',
      url: `/users/${second.user.id}`,
      headers: { authorization: `Bearer ${second.token}` },
      payload: { email: first.email },
    });

    expect(response.statusCode).toBe(409);
  });
});

describe('DELETE /users/:id (Delete)', () => {
  it('deletes the authenticated user own account', async () => {
    const { token, user } = await createAndLoginUser();

    const response = await app.inject({
      method: 'DELETE',
      url: `/users/${user.id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(204);

    const check = await prisma.user.findUnique({ where: { id: user.id } });
    expect(check).toBeNull();
  });

  it('rejects deleting another user account', async () => {
    const { token } = await createAndLoginUser();
    const otherUser = await createAndLoginUser();

    const response = await app.inject({
      method: 'DELETE',
      url: `/users/${otherUser.user.id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(403);
  });

  it('deletes user and their lists (cascade)', async () => {
    const { token, user } = await createAndLoginUser();

    const listResponse = await app.inject({
      method: 'POST',
      url: '/lists',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'List to be cascade deleted' },
    });

    const list = listResponse.json();

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/users/${user.id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(deleteResponse.statusCode).toBe(204);

    const checkList = await prisma.list.findUnique({ where: { id: list.id } });
    expect(checkList).toBeNull();
  });
});