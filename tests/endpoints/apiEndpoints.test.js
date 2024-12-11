const request = require('supertest');
const app = require('../../app'); // Your Express app

describe('API Endpoints', () => {
  test('GET /status should return status 200', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ redis: true, db: true });
  });

  test('POST /users should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  test('GET /files should paginate files', async () => {
    const response = await request(app).get('/files?page=1&size=10');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
