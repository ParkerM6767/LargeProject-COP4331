import { Request, Response } from 'express'
import { User } from '../../models/user.model'

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body

    const user = await User.findOne({ email })

    if (!user || !user.verificationCode) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid code' })
    }

    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < new Date()
    ) {
      return res.status(400).json({ message: 'Code expired' })
    }

    user.isVerified = true

    user.verificationCode = undefined
    user.verificationCodeExpires = undefined

    await user.save()

    return res.status(200).json({ message: 'Email verified successfully' })
  }catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
}
