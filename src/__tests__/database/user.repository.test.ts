import { UserRepository } from '../../repositories/user.repository';
import pool from '../../config/database';
import initDb from '../../config/init-db';

describe('UserRepository Database Validation', () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    await initDb();
    userRepository = new UserRepository();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should insert and retrieve a user from the database', async () => {
    const userData = {
      username: 'db_test_user',
      email: 'db_test@example.com',
      password: 'hashed_password'
    };

    const createdUser = await userRepository.create(userData);
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.username).toBe(userData.username);

    const foundUser = await userRepository.findById(createdUser.id);
    expect(foundUser).not.toBeNull();
    expect(foundUser?.email).toBe(userData.email);
  });

  it('should enforce unique constraint on email', async () => {
    const userData = {
      username: 'user_unique_1',
      email: 'unique@example.com',
      password: 'password'
    };

    await userRepository.create(userData);

    const duplicateData = {
      username: 'user_unique_2',
      email: 'unique@example.com',
      password: 'password'
    };

    await expect(userRepository.create(duplicateData)).rejects.toThrow();
  });
});
