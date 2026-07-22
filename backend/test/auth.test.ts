import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';
import { prisma } from '../src/models/prisma';

let app: FastifyInstance;
const email = `auth-test-${Date.now()}@example.com`;
const password = '123456';

beforeAll(async () => {
  app = await buildApp();
  await app.ready();

  await app.inject({
    method: 'POST',
    url: '/users',
    payload: { name: 'Auth Test User', email, password },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

describe('POST /auth/login', () => {
  it('logs in successfully with correct credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email, password },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.access_token).toBeDefined();
    expect(body.user.email).toBe(email);
    expect(body.user.password).toBeUndefined();
  });

  it('rejects wrong password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email, password: 'wrong_password' },
    });

    expect(response.statusCode).toBe(401);
  });

  it('rejects login for non-existent user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'doesnotexist@example.com', password: '123456' },
    });

    expect(response.statusCode).toBe(401);
  });

  it('rejects missing fields', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email },
    });

    expect(response.statusCode).toBe(400);
  });

  it('rejects login for a Google-only account (no password set)', async () => {
    // Simula um usuário criado só via Google (sem senha), direto no banco
    const googleOnlyEmail = `google-only-${Date.now()}@example.com`;

    await prisma.user.create({
      data: {
        name: 'Google Only User',
        email: googleOnlyEmail,
        googleId: `google-id-${Date.now()}`,
      },
    });

    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: googleOnlyEmail, password: 'any_password' },
    });

    expect(response.statusCode).toBe(401);
  });
});

describe('POST /auth/google', () => {
  it('rejects request without idToken', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/google',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('rejects an invalid/malformed idToken', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/google',
      payload: { idToken: 'this-is-not-a-real-google-token' },
    });

    expect(response.statusCode).toBe(401);
  });
});