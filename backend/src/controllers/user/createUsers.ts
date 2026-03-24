import { Request, Response } from "express";
import { client } from "../../db";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
const db = client.db("sitedata")

export async function createUser(req: Request, res: Response) {
    let fname: String = req.body.first_name;
    let lname: string = req.body.last_name;
    let email: string = req.body.email;
    let password_unhashed: string = req.body.password;
    let password_hashed = await bcrypt.hash(password_unhashed, SALT_ROUNDS);
    console.log(`Plaintext: ${password_unhashed}\nHashed: ${password_hashed}`);
    const user_collection = db.collection('users');
    
    res.status(200).json({message:`Post Made by ${fname}`});
}