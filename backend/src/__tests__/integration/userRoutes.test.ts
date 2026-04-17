import request from "supertest";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { User } from '../../models/user.model';
import userRoutes from "../../routes/userRoutes";
import express from "express";
import cookieParser from "cookie-parser";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany({});
});

jest.mock('../../utils/email', () => ({
  sendVerificationEmail: jest.fn()
}));
process.env.JWT_SECRET = 'testsecret';

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/users', userRoutes)

describe("User Routes Integration Tests", () => {
    it('should create a user, mark them verified, and then login successfully', async () => {
        const email = 'testuser@ucf.edu';
        const password = 'password123';

        const createResponse = await request(app)
            .post('/api/users/createUser')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email,
                password
            });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body).toHaveProperty('user.email', email);

        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        ).lean();

        expect(user).not.toBeNull();
        expect(user?.isVerified).toBe(true);

        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                email,
                password
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('id');
        expect(loginResponse.headers['set-cookie']).toBeDefined();
    });

    it('should login an existing verified user stored directly in MongoDB', async () => {
        const email = 'verifieduser@ucf.edu';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName: 'Verified',
            lastName: 'User',
            email,
            password: hashedPassword,
            isVerified: true
        });

        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                email,
                password
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('id');
        expect(loginResponse.headers['set-cookie']).toBeDefined();
    });
});