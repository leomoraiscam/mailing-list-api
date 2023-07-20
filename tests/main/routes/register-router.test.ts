import request from 'supertest';

import { mongoHelper } from '@/external/repositories/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';

describe('Register Router', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    await mongoHelper.clearCollection('users');
  });

  it('should return an account on success', async () => {
    app.post('/test_cors', (req, res) => {
      res.send();
    });
    await request(app)
      .post('/api/register')
      .send({
        name: 'any name',
        email: 'any@email.com',
      })
      .expect(201);
  }, 50000);
});