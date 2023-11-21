import { Sequelize } from 'sequelize-typescript';
import { User } from '../src/models/user.model';
import { UserService } from '../src/services/user.service';

describe('UserService', () => {
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

    test('create and validate user', async () => {
        const userData = { username: 'testuser2', email: 'test2@example.com', password: 'password123' };
        // Create user
        const createdUser = await UserService.createUser(userData);
        // Validate user
        const validatedUser = await UserService.validateUser(userData.email, userData.password);

        expect(validatedUser).toBeTruthy();
        expect(validatedUser?.username).toBe(userData.username);
        expect(validatedUser?.email).toBe(userData.email);
    });



    // Add more tests for other UserService methods
});
