import request from 'supertest'
import express from 'express'
import { verifyEmail } from '../../../../controllers/user/verifyEmail'

// Mock the User model
jest.mock('../../../../models/user.model', () => ({
  User: {
    findOne: jest.fn()
  }
}))

import { User } from '../../../../models/user.model'

const app = express()
app.use(express.json())
app.post('/verify-email', verifyEmail)

describe('POST /verify-email', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should verify email successfully', async () => {
    const mockUser = {
      email: 'test@test.com',
      verificationCode: '123456',
      verificationCodeExpires: new Date(Date.now() + 10000),
      isVerified: false,
      save: jest.fn()
    }

    ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

    const res = await request(app)
      .post('/verify-email')
      .send({ email: 'test@test.com', code: '123456' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Email verified successfully')
    expect(mockUser.isVerified).toBe(true)
    expect(mockUser.verificationCode).toBeUndefined()
    expect(mockUser.verificationCodeExpires).toBeUndefined()
    expect(mockUser.save).toHaveBeenCalled()
  })

  it('should return invalid request if user not found', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue(null)

    const res = await request(app)
      .post('/verify-email')
      .send({ email: 'test@test.com', code: '123456' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid request')
  })

  it('should return invalid request if no verification code', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue({
      verificationCode: undefined
    })

    const res = await request(app)
      .post('/verify-email')
      .send({ email: 'test@test.com', code: '123456' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid request')
  })

  it('should return invalid code', async () => {
    const mockUser = {
      verificationCode: '123456',
      verificationCodeExpires: new Date(Date.now() + 10000)
    }

    ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

    const res = await request(app)
      .post('/verify-email')
      .send({ email: 'test@test.com', code: '000000' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid code')
  })

  it('should return expired code', async () => {
    const mockUser = {
      verificationCode: '123456',
      verificationCodeExpires: new Date(Date.now() - 10000)
    }

    ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

    const res = await request(app)
      .post('/verify-email')
      .send({ email: 'test@test.com', code: '123456' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Code expired')
  })

  it('should return server error on exception', async () => {
    ;(User.findOne as jest.Mock).mockRejectedValue(new Error('DB error'))

    const res = await request(app)
      .post('/verify-email')
      .send({ email: 'test@test.com', code: '123456' })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Server error')
  })

})