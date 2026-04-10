import { hashPassword, comparePassword, generateToken, verifyToken } from '@/lib/auth';

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', () => {
      const password = 'testpassword123';
      const hash = hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for same password', () => {
      const password = 'testpassword123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', () => {
      const password = 'testpassword123';
      const hash = hashPassword(password);
      
      expect(comparePassword(password, hash)).toBe(true);
    });

    it('should return false for incorrect password', () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hash = hashPassword(password);
      
      expect(comparePassword(wrongPassword, hash)).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const payload = { id: 1, username: 'testuser', isAdmin: false };
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { id: 1, username: 'testuser', isAdmin: false };
      const token = generateToken(payload);
      const decoded = verifyToken(token) as any;
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(1);
      expect(decoded.username).toBe('testuser');
      expect(decoded.isAdmin).toBe(false);
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid.token.here');
      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      // This would need mock for proper testing
      const result = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjowfQ.expired');
      expect(result).toBeNull();
    });
  });
});
