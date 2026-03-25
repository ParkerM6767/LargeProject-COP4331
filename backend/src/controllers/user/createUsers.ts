import { Request, Response } from "express";
import { User } from '../../models/user.model'
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

export async function createUser(req: Request, res: Response) {
    try {
        let first_name: string = req.body.first_name;
        let last_name: string = req.body.last_name;
        let email: string = req.body.email;
        let password_unhashed: string = req.body.password;
        let password_hashed = await bcrypt.hash(password_unhashed, SALT_ROUNDS);
        
        const user = await User.create({
            firstName: first_name,
            lastName: last_name,
            email: email,
            password: password_hashed
        });
        res.status(201).json({user});
    } catch(err) {
        res.status(500).json({ error:"Failed to create user" });
    }
}