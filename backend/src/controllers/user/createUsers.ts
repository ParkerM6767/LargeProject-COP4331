import { Request, Response } from "express";
import "../../db";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

export function createUser(req: Request, res: Response) {
    console.log(req.body);
    let fname: string = req.body.first_name;
    let lname: string = req.body.last_name;
    let email: string = req.body.email;
    let password_unhashed: string = req.body.password;
    const password_hashed = bcrypt.hash(password_unhashed, SALT_ROUNDS);
    console.log(`Plaintext: ${password_unhashed}\nHashed: ${password_hashed}`);
    
    res.status(200).json({message:`Post Made by ${fname}`});
}