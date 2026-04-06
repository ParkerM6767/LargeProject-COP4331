import { Request, Response } from 'express'
import { User } from '../../models/user.model'
import bcrypt from 'bcrypt'
const SALT_ROUNDS = 10

export async function createUser (req: Request, res: Response) {
  try {
    const firstName: string = req.body.first_name
    const lastName: string = req.body.last_name
    const email: string = req.body.email
    const passwordUnhashed: string = req.body.password

    if (!firstName || firstName.trim().length === 0) {
      return res.status(400).json({ error: 'First name is required' })
    }

    if (firstName.length > 50) {
      return res
        .status(400)
        .json({ error: 'First name must be less than 50 characters long' })
    }

    if (!lastName || lastName.trim().length === 0) {
      return res.status(400).json({ error: 'Last name is required' })
    }

    if (lastName.length > 100) {
      return res
        .status(400)
        .json({ error: 'Last name must be less than 100 characters long' })
    }

    if (!email || email.trim().length === 0) {
      return res.status(400).json({ error: 'Email is required' })
    }

    if (email.length > 255) {
      return res
        .status(400)
        .json({ error: 'Email must be less than 255 characters long' })
    }

    if (!/^[a-zA-Z0-9]+@ucf\.edu$/.test(email)) {
      return res
        .status(400)
        .json({ error: 'Must enter a valid UCF email address' })
    }

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ error: 'An account with that email already exists' })
    }

    if (!passwordUnhashed || passwordUnhashed.trim().length === 0) {
      return res.status(400).json({ error: 'Password is required' })
    }

    if (passwordUnhashed.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' })
    }

    if (passwordUnhashed.length > 72) {
      return res
        .status(400)
        .json({ error: 'Password must be less than 72 characters long' })
    }

    const passwordHashed = await bcrypt.hash(passwordUnhashed, SALT_ROUNDS)

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHashed
    })
    res.status(201).json({ user })
  } catch (err) {
    res.status(500).json({ error: `${err}` })
  }
}
