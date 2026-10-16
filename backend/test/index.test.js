const request = require('supertest');
const app = require('../src/index'); // Adjust the path as necessary

describe('GET /', () => {
    it('should respond with a 200 status and a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Welcome to my Node.js app!'); // Adjust the expected message as necessary
    });
});

// Add more tests for other routes as needed.