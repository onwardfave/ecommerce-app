import { Sequelize } from 'sequelize-typescript';
import { User } from '../src/models/user.model';

import { UniqueConstraintError } from 'sequelize';


describe('User Model', () => {
    let sequelize: Sequelize;

    beforeAll(async () => {

        // Setup Sequelize with SQLite in-memory database for testing
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [User], // Include your models here
            logging: false // Disable logging for clearer test output
        });

        await sequelize.sync({ force: true }); // Sync all models

    });

    afterAll(async () => {
        await sequelize.close();
    });

    // Tests go here...

    test('create user successfully', async () => {

        const userData = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123'
        };

        const user = await User.create(userData);

        expect(user.username).toBe(userData.username);
        expect(user.email).toBe(userData.email);
        expect(user.id).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();

    });


    test('create user with duplicate email', async () => {
        const userData = {
            username: 'john_doe',
            email: 'john1@example.com',
            password: 'password123'
        };

        // Create the first user
        await User.create(userData);

        // Attempt to create a second user with the same email
        try {
            await User.create(userData);
            fail('Should have thrown a UniqueConstraintError');
        } catch (error) {
            // Inspect the error to ensure it's the correct type
            expect(error).toBeInstanceOf(UniqueConstraintError);
            // Optional: Check the error message or other properties
        }
    });

    // Creates a user with a missing email and throws an error
    test('create user with missing email', async () => {

        const userData = {
            username: 'john_doe',
            password: 'password123'
        };

        await expect(User.create(userData)).rejects.toThrow();

    });

    // Creates a user with a missing password and throws an error
    test('create user with missing password', async () => {

        const userData = {
            username: 'john_doe',
            email: 'john4@example.com'
        };

        await expect(User.create(userData)).rejects.toThrow();

    });

    // Creates a user with a missing username field and throws an error
    test('create user with missing username field', async () => {
        const userData = {
            email: 'john3@example.com',
            password: 'password123'
        };

        await expect(User.create(userData)).rejects.toThrow();
    });



});
