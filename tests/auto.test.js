const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../models/User');
const { app } = require('../index');

const testUsername = 'testuser';
const testPassword = 'testpassword';
const testAge = 50;

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Test server functionality', () => {
    it('should return 200 on /', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});

describe('Auto API', () => {
    it('should register a user', async () => {
        const existingUser = await User.findOne({ username: testUsername});
        if (!existingUser) {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: testUsername,
                    password: testPassword,
                    age: testAge
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
        }
        else{
            console.log(`User ${testUsername} already exists. Skipping registration test.`);
        }
    });

    it ('should login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testuser',
                password: 'testpassword123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
    });
});