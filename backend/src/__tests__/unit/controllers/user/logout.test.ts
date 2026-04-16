import request from 'supertest';
import express from 'express';
import { logout } from '../../../../controllers/user/logout';

describe('POST /logout', () => {
  const app = express();
  app.post('/logout', logout);

  it('should clear the token cookie and return 200', async () => {
    const response = await request(app)
      .post('/logout')
      .set('Cookie', 'token=test-token')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Logged Out' });

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(Array.isArray(setCookieHeader)).toBe(true);
    expect((setCookieHeader as string)[0]).toMatch(/token=;/);
  });
});