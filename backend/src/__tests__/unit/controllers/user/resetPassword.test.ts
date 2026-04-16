import request from 'supertest'
import express from 'express'
import {
  forgotPassword,
  resetPassword
} from '../../../../controllers/user/resetPassword'
import { User } from '../../../../models/user.model'

jest.mock('../../../../models/user.model', () => ({
  User: {
    findOne: jest.fn(),
    save: jest.fn()
  }
}))

jest.mock('../../../../utils/email', () => ({
  forgotPasswordEmail: jest.fn().mockResolvedValue(true)
}))

// ─── App Setup ────────────────────────────────────────────────────────────────

const app = express()
app.use(express.json())

app.post('/forgot-password', forgotPassword)
app.put('/reset-password', resetPassword)

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockUser = {
  _id: '1',
  email: 'user@ucf.edu',
  password: 'hashedpassword',
  resetToken: null,
  resetTokenExpires: null,
  save: jest.fn().mockResolvedValue(true)
}

// -------- Tests --------------------------------------------------------

describe('POST /forgot-password', () => {
  beforeAll(() => {
    ;(User.findOne as jest.Mock).mockReset()
  })

  it('should process forgot password request successfully', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

    const response = await request(app)
      .post('/forgot-password')
      .send({ email: 'user@ucf.edu' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'If email exists, a reset link will be sent'
    })
  })

  it('should return 200 even if email does not exist', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue(null)

    const response = await request(app)
      .post('/forgot-password')
      .send({ email: 'nonexistent@ucf.edu' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'If email exists, a reset link will be sent'
    })
  })

  it('should return 400 if email is not provided', async () => {
    const response = await request(app)
      .post('/forgot-password')
      .send({ email: '' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'Email is required' })
  })

  it('should return 500 if there is a server error', async () => {
    ;(User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app)
      .post('/forgot-password')
      .send({ email: 'user@ucf.edu' })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      message: 'Failed to process forgot password request'
    })
  })
})

describe('PUT /reset-password', () => {
  beforeAll(() => {
    ;(User.findOne as jest.Mock).mockReset()
  })

  it('should reset password successfully', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

    const response = await request(app)
      .put('/reset-password')
      .send({ token: 'validtoken', newPassword: 'newpassword' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Password reset successful' })
  })

  it('should return 400 if token or new password is missing', async () => {
    const response = await request(app)
      .put('/reset-password')
      .send({ token: '', newPassword: '' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Token and new password are required'
    })
  })

  it('should return 400 if token is invalid or expired', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue(null)

    const response = await request(app)
      .put('/reset-password')
      .send({ token: 'invalidtoken', newPassword: 'newpassword' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'Invalid or expired token' })
  })

  it('should return 400 if new password is the same as old password', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue({
      ...mockUser,
      password: 'samepassword'
    })

    const response = await request(app)
      .put('/reset-password')
      .send({ token: 'validtoken', newPassword: 'samepassword' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'New password cannot be the same as the old password'
    })
  })

  it('should return 500 if there is a server error', async () => {
    ;(User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app)
      .put('/reset-password')
      .send({ token: 'validtoken', newPassword: 'newpassword' })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ message: 'Failed to reset password' })
  })
})
