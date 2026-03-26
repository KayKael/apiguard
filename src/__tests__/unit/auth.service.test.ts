import { AuthService } from '../../services/auth.service';
import { UserRepository } from '../../repositories/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../repositories/user.repository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    authService = new AuthService();
    // Injetar o mock manualmente se necessário, mas aqui o service cria uma nova instância.
    // Para testes unitários puros, o ideal seria injeção de dependência.
    // Vamos mockar o protótipo para este exemplo.
    (UserRepository.prototype.findByEmail as jest.Mock).mockReset();
    (UserRepository.prototype.create as jest.Mock).mockReset();
  });

  describe('register', () => {
    it('should throw error if email already exists', async () => {
      (UserRepository.prototype.findByEmail as jest.Mock).mockResolvedValue({ id: 1 });
      
      await expect(authService.register({ email: 'test@test.com' }))
        .rejects.toMatchObject({ status: 400, message: 'Email already in use' });
    });

    it('should create a new user and return token', async () => {
      (UserRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(null);
      (UserRepository.prototype.findByUsername as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (UserRepository.prototype.create as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password'
      });
      (jwt.sign as jest.Mock).mockReturnValue('fake_token');

      const result = await authService.register({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      });

      expect(result).toHaveProperty('token', 'fake_token');
      expect(result.user).not.toHaveProperty('password');
      expect(UserRepository.prototype.create).toHaveBeenCalled();
    });
  });
});
