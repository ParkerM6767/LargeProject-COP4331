import { Request, Response } from "express";

export async function logout(req: Request, res: Response){
    res.clearCookie('token');
    res.status(200).json({ message:"Logged Out"});
}