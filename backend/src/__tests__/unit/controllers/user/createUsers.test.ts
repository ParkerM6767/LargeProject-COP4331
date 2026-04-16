import request from 'supertest'
import express from 'express'
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from '../../../../utils/email'
import { createUser } from '../../../../controllers/user/createUsers'
import { User } from '../../../../models/user.model'

jest.mock('../../../../models/user.model', () => ({
  User: {
    create: jest.fn()
  }
}))

jest.mock('../../../../utils/email', () => ({
  sendVerificationEmail: jest.fn()
}))

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}))

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.user = 'testUserId'
  next()
})

app.post('/createUser', createUser)

describe('POST /createUser', () => {
  beforeEach(() => {
    (User.create as jest.Mock).mockReset();
    (bcrypt.hash as jest.Mock).mockReset();
    (sendVerificationEmail as jest.Mock).mockReset()
  })

  it('should create a user successfully', async () => {
    const hashedPassword = 'hashed-password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)

    const requestBody = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      password: 'Password123'
    }

    const createdUser = {
      _id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: hashedPassword,
      verificationCode: '123456',
      verificationCodeExpires: '2026-01-01T00:00:00.000Z',
      isVerified: false
    };

    (User.create as jest.Mock).mockResolvedValue(createdUser)

    const response = await request(app)
      .post('/createUser')
      .send(requestBody)
    expect(response.status).toBe(201)
    expect(response.body).toEqual({ user: createdUser })
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: hashedPassword,
        isVerified: false,
        verificationCode: expect.any(String),
        verificationCodeExpires: expect.any(Date)
      })
    )
    expect((User.create as jest.Mock).mock.calls[0][0].password).not.toBe(requestBody.password)
  })

  it('should return 500 if user creation fails', async () => {
    const hashedPassword = 'hashed-password'
    ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)
    ;(User.create as jest.Mock).mockRejectedValue(new Error('Database failure'))

    const response = await request(app)
      .post('/createUser')
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        password: 'Password123'
      })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Error: Database failure' })
  })
})