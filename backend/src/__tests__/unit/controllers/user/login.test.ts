import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import { login } from '../../../../controllers/user/login';
import { User } from '../../../../models/user.model';

jest.mock('../../../../models/user.model', () => ({
  User: {
    findOne: jest.fn()
  }
}))
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}))

process.env.JWT_SECRET = 'testsecret';

const app = express();
app.use(express.json());
app.post('/login', login);

describe('POST /login', () => {
  beforeEach(() => {
    (User.findOne as jest.Mock).mockReset();
    (bcrypt.compare as jest.Mock).mockReset();
  });

  it('should login successfully', async () => {
    const mockUser = {
      _id: '1',
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'hashed-password',
      isVerified: true
    };

    // simulate DB finding user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    // simulate password match
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'jane.doe@example.com',
        password: 'hashed-password'
      })

    expect(response.status).toBe(200)

    expect(User.findOne).toHaveBeenCalledWith({
      email: 'jane.doe@example.com'
    })

    expect(bcrypt.compare).toHaveBeenCalledWith(
      'hashed-password',
      mockUser.password
    )
  })

  it('should return 400 if user not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null)

    const response = await request(app)
      .post('/login')
      .send({
        email: 'notfound@example.com',
        password: 'Password123'
      })

    expect(response.status).toBe(400)
  })

  it('should return 400 if password is incorrect', async () => {
    const mockUser = {
      email: 'jane.doe@example.com',
      password: 'hashed-password'
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'jane.doe@example.com',
        password: 'WrongPassword'
      })

    expect(response.status).toBe(400)
  })

  it('should return 500 if database fails', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(
      new Error('Database failure')
    )

    const response = await request(app)
      .post('/login')
      .send({
        email: 'jane.doe@example.com',
        password: 'Password123'
      })

    expect(response.status).toBe(500)
  })
})