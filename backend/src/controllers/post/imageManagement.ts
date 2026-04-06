import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'node:path';

const staticImgPath = import.meta.dirname + '/../../../public/images/posts';

export const storeImage = (req: Request, res: Response, next: NextFunction) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, staticImgPath);
        },
        filename: (req: Request, file, cb) => {
            const extension = path.extname(file.originalname);
            const userId = req.user as string;
            if (!userId) {
                return cb(new Error("User not authenticated"), "");
            }
            const imageName = `${userId}${extension}`;
            cb(null, imageName);
        }
    });
    const upload = multer({ storage }).single("image");
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};