import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { BaseTest } from '../../helpers/BaseTest';
import { AssertionHelpers } from '../../utils/AssertionHelpers';

class AuthTest extends BaseTest {
  constructor() {
    super({
      baseURL: 'https://api.escuelajs.co',
      timeout: 10000
    });
  }
}

describe('Authentication API Tests', () => {
  let authTest: AuthTest;
  let accessToken: string;

  before(() => {
    authTest = new AuthTest();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'john@mail.com',
        password: 'changeme'
      };

      const response = await authTest.post('/api/v1/auth/login', credentials, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 201);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('access_token');
      expect(response.body).to.have.property('refresh_token');
      expect(response.body.access_token).to.be.a('string');
      expect(response.body.refresh_token).to.be.a('string');
      
      accessToken = response.body.access_token;
    });

    it('should reject invalid credentials', async () => {
      const invalidCredentials = {
        email: 'john@mail.com',
        password: 'wrongpassword'
      };

      const response = await authTest.post('/api/v1/auth/login', invalidCredentials, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 401);
    });

    it('should validate required fields for login', async () => {
      const incompleteCredentials = {
        email: 'john@mail.com'
      };

      const response = await authTest.post('/api/v1/auth/login', incompleteCredentials, {
        'Content-Type': 'application/json'
      });
      
      expect([400, 422]).to.include(response.status);
    });

    it('should validate email format', async () => {
      const invalidEmailCredentials = {
        email: 'invalid-email',
        password: 'changeme'
      };

      const response = await authTest.post('/api/v1/auth/login', invalidEmailCredentials, {
        'Content-Type': 'application/json'
      });
      
      expect([400, 422]).to.include(response.status);
    });

    it('should reject non-existent user', async () => {
      const nonExistentUserCredentials = {
        email: 'nonexistent@mail.com',
        password: 'password123'
      };

      const response = await authTest.post('/api/v1/auth/login', nonExistentUserCredentials, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 401);
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      if (!accessToken) {
        const loginResponse = await authTest.post('/api/v1/auth/login', {
          email: 'john@mail.com',
          password: 'changeme'
        }, {
          'Content-Type': 'application/json'
        });
        accessToken = loginResponse.body.access_token;
      }

      const response = await authTest.get('/api/v1/auth/profile', {
        'Authorization': `Bearer ${accessToken}`
      });
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('email');
      expect(response.body).to.have.property('role');
      expect(response.body).to.have.property('avatar');
    });

    it('should reject request without authorization header', async () => {
      const response = await authTest.get('/api/v1/auth/profile');
      
      AssertionHelpers.expectStatus(response, 401);
    });

    it('should reject request with invalid token', async () => {
      const response = await authTest.get('/api/v1/auth/profile', {
        'Authorization': 'Bearer invalid-token'
      });
      
      AssertionHelpers.expectStatus(response, 401);
    });

    it('should reject request with malformed authorization header', async () => {
      const response = await authTest.get('/api/v1/auth/profile', {
        'Authorization': 'InvalidTokenFormat'
      });
      
      AssertionHelpers.expectStatus(response, 401);
    });
  });

  describe('Token Security Tests', () => {
    it('should ensure token is properly formatted JWT', async () => {
      if (accessToken) {
        const tokenParts = accessToken.split('.');
        expect(tokenParts).to.have.lengthOf(3);
        
        tokenParts.forEach(part => {
          expect(part).to.be.a('string');
          expect(part.length).to.be.greaterThan(0);
        });
      }
    });

    it('should have reasonable token expiration', async () => {
      if (accessToken) {
        const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
        expect(payload).to.have.property('exp');
        expect(payload).to.have.property('iat');
        
        const expirationTime = payload.exp - payload.iat;
        expect(expirationTime).to.be.greaterThan(0);
        expect(expirationTime).to.be.lessThan(86400 * 30);
      }
    });
  });
});