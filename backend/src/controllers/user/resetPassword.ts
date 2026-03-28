import { Request, Response } from 'express'
import { User } from '../../models/user.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { forgotPasswordEmail } from '../../utils/email'

// POST /forgot-password
export async function forgotPassword (req: Request, res: Response) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(200)
        .json({ message: 'If email exists, a reset link will be sent' })
    }

    const token = crypto.randomBytes(32).toString('hex')

    user.resetToken = token
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await user.save()

    await forgotPasswordEmail(email, token, `${req.protocol}://${req.get('host')}`)

    res
      .status(200)
      .json({ message: 'If email exists, a reset link will be sent' })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: 'Failed to process forgot password request' })
  }
}

// PUT /reset-password
export async function resetPassword (req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Token and new password are required' })
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired token'
      })
    }

    if (newPassword === user.password) {
      return res.status(400).json({
        message: 'New password cannot be the same as the old password'
      })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.resetToken = undefined
    user.resetTokenExpires = undefined

    await user.save()
    res.status(200).json({ message: 'Password reset successful' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to reset password' })
  }
}
