import { Router } from 'express';

import { createUser } from '../controllers/user/createUsers';

const userrouter = Router();

userrouter.post('/createUser', createUser);
export default userrouter;