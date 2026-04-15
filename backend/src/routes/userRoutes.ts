import { Router } from 'express'
import { verifyEmail } from '../controllers/user/verifyEmail'
import { createUser } from '../controllers/user/createUsers';
import { login } from '../controllers/user/login';
import { logout } from '../controllers/user/logout';
import { forgotPassword, resetPassword } from '../controllers/user/resetPassword';

const userrouter = Router();

userrouter.post('/createUser', createUser);
userrouter.post('/login', login);
userrouter.post('/logout', logout);
userrouter.post('/forgot-password', forgotPassword);
userrouter.put('/reset-password', resetPassword);
userrouter.post('/verify-email', verifyEmail)

export default userrouter;
