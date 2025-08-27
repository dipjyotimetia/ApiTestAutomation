import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { BaseTest } from '../../helpers/BaseTest';
import { AssertionHelpers } from '../../utils/AssertionHelpers';

class UsersTest extends BaseTest {
  constructor() {
    super({
      baseURL: 'https://api.escuelajs.co',
      timeout: 10000
    });
  }
}

describe('Users API Tests', () => {
  let usersTest: UsersTest;
  let createdUserId: number;

  before(() => {
    usersTest = new UsersTest();
  });

  describe('GET /api/v1/users', () => {
    it('should get all users', async () => {
      const response = await usersTest.get('/api/v1/users/');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      
      const firstUser = response.body[0];
      expect(firstUser).to.have.property('id');
      expect(firstUser).to.have.property('name');
      expect(firstUser).to.have.property('email');
      expect(firstUser).to.have.property('role');
      expect(firstUser).to.have.property('avatar');
    });
  });

  describe('GET /api/v1/users/{id}', () => {
    it('should get a single user by ID', async () => {
      const response = await usersTest.get('/api/v1/users/1');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('email');
      expect(response.body).to.have.property('role');
      expect(response.body).to.have.property('avatar');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await usersTest.get('/api/v1/users/999999');
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123',
        avatar: 'https://api.lorem.space/image/face?w=640&h=480'
      };

      const response = await usersTest.post('/api/v1/users/', newUser, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 201);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('name', newUser.name);
      expect(response.body).to.have.property('email', newUser.email);
      expect(response.body).to.have.property('role');
      expect(response.body).to.have.property('avatar');
      
      createdUserId = response.body.id;
    });

    it('should validate required fields for user creation', async () => {
      const invalidUser = {
        name: 'Test User'
      };

      const response = await usersTest.post('/api/v1/users/', invalidUser, {
        'Content-Type': 'application/json'
      });
      
      expect([400, 422]).to.include(response.status);
    });

    it('should validate email format', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'testpassword123'
      };

      const response = await usersTest.post('/api/v1/users/', invalidUser, {
        'Content-Type': 'application/json'
      });
      
      expect([400, 422]).to.include(response.status);
    });
  });

  describe('POST /api/v1/users/is-available', () => {
    it('should check if email is available', async () => {
      const emailCheck = {
        email: 'available@test.com'
      };

      const response = await usersTest.post('/api/v1/users/is-available', emailCheck, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('isAvailable');
      expect(response.body.isAvailable).to.be.a('boolean');
    });

    it('should return false for existing email', async () => {
      const emailCheck = {
        email: 'john@mail.com'
      };

      const response = await usersTest.post('/api/v1/users/is-available', emailCheck, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 200);
      expect(response.body.isAvailable).to.equal(false);
    });
  });

  describe('PUT /api/v1/users/{id}', () => {
    it('should update an existing user', async () => {
      const updatedUser = {
        name: 'Updated User Name'
      };

      const response = await usersTest.put('/api/v1/users/1', updatedUser, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('name', updatedUser.name);
    });

    it('should return 404 when updating non-existent user', async () => {
      const updatedUser = {
        name: 'Updated User Name'
      };

      const response = await usersTest.put('/api/v1/users/999999', updatedUser, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });

  describe('DELETE /api/v1/users/{id}', () => {
    it('should delete a user', async () => {
      if (createdUserId) {
        const response = await usersTest.delete(`/api/v1/users/${createdUserId}`);
        
        expect([200, 204]).to.include(response.status);
      }
    });

    it('should return 404 when deleting non-existent user', async () => {
      const response = await usersTest.delete('/api/v1/users/999999');
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });
});