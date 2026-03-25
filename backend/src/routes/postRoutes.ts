import { Router } from 'express';

import { createPost } from '../controllers/post/createPosts';

const postrouter = Router();

postrouter.post('/createPost', createPost);
export default postrouter;