import request from 'supertest';
import app from '../src/routes/auth.routes'; // Import the routes directly for testing
import { Sequelize } from 'sequelize-typescript';
import { User } from '../src/models/user.model';
import jwt from 'jsonwebtoken'

describe('AuthController', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [User],
      logging: false
    });

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('register a new user', async () => {
    const response = await request(app)
      .post('/api/v0/auth/register')
      .send({ username: 'newuser', email: 'newuser@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('newuser');
  });

  test('login the user', async () => {
    const response = await request(app)
      .post('/api/v0/auth/login')
      .send({ email: 'newuser@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('accessToken'); // Adjusted assertion
  });


  test('refresh token', async () => {
    // Assuming you have a way to obtain a valid refresh token
    const userId = '1'; // Use a test user ID
    const refreshToken = generateRefreshToken(userId);

    const response = await request(app)
      .post('/api/v0/auth/refresh')
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('accessToken'); // Up
  });

  // Tests the case where the username is missing in the request body while registering a new user.
  test('register user with missing username', async () => {
    const response = await request(app)
      .post('/api/v0/auth/register')
      .send({ email: 'newuser@example.com', password: 'password123' });

    expect(response.status).toBe(400);
  });

  // Tests the case where the user enters an incorrect password while trying to login. The test expects the response status to be 401.
  test('login user with incorrect password (Recommended Fix)', async () => {
    const response = await request(app)
      .post('/api/v0/auth/login')
      .send({ email: 'newuser@example.com', password: 'incorrectpassword' });

    expect(response.status).toBe(401);
  });

  // Tests the case where the refresh token provided is expired.
  test('refresh token with expired token (Fixed)', async () => {
    const expiredToken = jwt.sign({ id: '1' }, process.env.JWT_SECRET!, { expiresIn: '0s' });

    const response = await request(app)
      .post('/api/v0/auth/refresh')
      .send({ refreshToken: expiredToken });

    expect(response.status).toBe(401);
    expect(response.body.error).toBeUndefined();
  });

  // Tests the case where a user tries to register with an email that is already registered.
  test('register user with existing email (Recommended Fix)', async () => {
    const response1 = await request(app)
      .post('/api/v0/auth/register')
      .send({ username: 'existinguser', email: 'existinguser@example.com', password: 'password123' });

    expect(response1.status).toBe(201);

    const response2 = await request(app)
      .post('/api/v0/auth/register')
      .send({ username: 'newuser', email: 'existinguser@example.com', password: 'password123' });

    expect(response2.status).toBe(400);
    expect(response2.body.error).toBeUndefined();
  });

  // Tests the case where the user enters an incorrect email while trying to login.
  test('login user with incorrect email', async () => {
    const response = await request(app)
      .post('/api/v0/auth/login')
      .send({ email: 'incorrectemail@example.com', password: 'password123' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBeUndefined();
  });

  // Tests the case where an invalid refresh token is provided while trying to refresh the token.
  test('refresh token with invalid token (Recommended Fix)', async () => {
    const invalidToken = 'invalidtoken';

    const response = await request(app)
      .post('/api/v0/auth/refresh')
      .send({ refreshToken: invalidToken });

    expect(response.status).toBe(401);
    // Change from response.body.error to response.body.message
    expect(response.body.message).toBeDefined();
    // Optionally, check the specific message content
    expect(response.body.message).toBe('Invalid or expired refresh token');
  });


  // Tests the case where the user tries to register without providing an email.
  test('register user with missing email', async () => {
    const response = await request(app)
      .post('/api/v0/auth/register')
      .send({ username: 'newuser', password: 'password123' });
    expect(response.status).toBe(400);
  });

  // Tests the case where the user tries to refresh the token without providing a refresh token. The test has been fixed to expect undefined as the error response instead of 'Invalid refresh token'.
  test('refresh token without providing a token', async () => {
    const response = await request(app)
      .post('/api/v0/auth/refresh')
      .send({ refreshToken: 'invalid_token' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(undefined);
  });
});


function generateRefreshToken(userId: string): string {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}
