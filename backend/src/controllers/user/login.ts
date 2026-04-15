import bcrypt from 'bcrypt'
import { Request, Response } from "express";
import { User } from '../../models/user.model';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../../utils/email';

const maxTokenAge = 60 * 60 * 1000; // 1 Hour

export async function login(req: Request, res: Response) {
    try {
        const email = req.body.email;
        const password_unhashed = req.body.password;

        const user_query = await User.findOne({ email });
        if (!user_query) return res.status(400).json({ "message": "invalid credentials" });

        const correct_credentials: boolean = await bcrypt.compare(password_unhashed, user_query.password);
        if (!correct_credentials) return res.status(400).json({ "message": "invalid credentials" });

        
        if (!user_query.isVerified) {
            const newCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now

            user_query.verificationCode = newCode;
            user_query.verificationCodeExpires = expires;

            await user_query.save(); // update user in DB
            await sendVerificationEmail(email, newCode);

            return res.status(403).json({ "message": "Email not verified. A new verification code has been sent." });
        }

    
        const token = jwt.sign({ id: user_query._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: maxTokenAge
        });
        res.status(200).json({ id: user_query._id });

        res.status(200).json({
            id: user_query._id,
            firstName: user_query.firstName,
            lastName: user_query.lastName
        });
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
}
