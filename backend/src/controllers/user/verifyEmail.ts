import { Request, Response } from 'express'
import { User } from '../../models/user.model'

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body

    const user = await User.findOne({ email })

    if (!user || !user.resetToken) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (user.resetToken !== code) {
      return res.status(400).json({ message: 'Invalid code' })
    }

    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      return res.status(400).json({ message: 'Code expired' })
    }

    user.resetToken = undefined
    user.resetTokenExpires = undefined

    await user.save()

    return res.json({ message: 'Email verified successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
}
