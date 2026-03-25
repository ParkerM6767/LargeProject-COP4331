import { Router } from 'express';

import { createUser } from '../controllers/user/createUsers';
import { login } from '../controllers/user/login';

const userrouter = Router();

userrouter.post('/createUser', createUser);
userrouter.post('/login', login);
export default userrouter;