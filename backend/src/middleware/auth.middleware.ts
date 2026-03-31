import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

interface MyJwtPayload {
    id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //const token = req.header('Authorization')?.split(' ')[1];
    const token = req.cookies.token;

    if(!token) return res.status(401).json({ message:"Token not provided, authorization denied"});

    try {
        const decode_token = jwt.verify(token, process.env.JWT_SECRET as string) as MyJwtPayload;
        req.user = decode_token.id;
        console.log(decode_token.id);
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}