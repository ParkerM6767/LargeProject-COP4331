import { Request, Response } from "express";
import "../../db";

export function createPost(req: Request, res: Response) {
    let name: String = req.body.name;
    res.status(200).json({message:`Post Made by ${name}`});
}