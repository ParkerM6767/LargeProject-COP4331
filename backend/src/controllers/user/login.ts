import bcrypt from 'bcrypt'
import { Request, Response } from "express";
import { User } from '../../models/user.model';

export async function login(req: Request, res: Response){
    const email = req.body.email;
    const password_unhashed = req.body.password;

    const user_query = await User.findOne( {email} );
    if(!user_query) return res.status(400).json({ "message":"invalid credentials" });

    const correct_credentials: boolean = await bcrypt.compare(password_unhashed, user_query.password);
    if(!correct_credentials) return res.status(400).json( {"message":"invalid credentials"} );

    //Finish up auth/jwt here
    return res.status(200).json( {"message":`Welcome ${user_query.firstName}`} );
}