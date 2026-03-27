import { Router } from 'express';

import { createUser } from '../controllers/user/createUsers';
import { login } from '../controllers/user/login';
import { logout } from '../controllers/user/logout';

const userrouter = Router();

userrouter.post('/createUser', createUser);
userrouter.post('/login', login);
userrouter.post('/logout', logout);
export default userrouter;