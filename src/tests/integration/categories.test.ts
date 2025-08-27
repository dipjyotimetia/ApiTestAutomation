import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { BaseTest } from '../../helpers/BaseTest';
import { AssertionHelpers } from '../../utils/AssertionHelpers';

class CategoriesTest extends BaseTest {
  constructor() {
    super({
      baseURL: 'https://api.escuelajs.co',
      timeout: 10000
    });
  }
}

describe('Categories API Tests', () => {
  let categoriesTest: CategoriesTest;
  let createdCategoryId: number;

  before(() => {
    categoriesTest = new CategoriesTest();
  });

  describe('GET /api/v1/categories', () => {
    it('should get all categories', async () => {
      const response = await categoriesTest.get('/api/v1/categories/');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      
      const firstCategory = response.body[0];
      expect(firstCategory).to.have.property('id');
      expect(firstCategory).to.have.property('name');
      expect(firstCategory).to.have.property('image');
    });
  });

  describe('GET /api/v1/categories/{id}', () => {
    it('should get a single category by ID', async () => {
      const response = await categoriesTest.get('/api/v1/categories/2');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id', 2);
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('image');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await categoriesTest.get('/api/v1/categories/999999');
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });

  describe('POST /api/v1/categories', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'Test Category',
        image: 'https://placehold.co/600x400'
      };

      const response = await categoriesTest.post('/api/v1/categories/', newCategory, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 201);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('name', newCategory.name);
      expect(response.body).to.have.property('image', newCategory.image);
      
      createdCategoryId = response.body.id;
    });

    it('should validate required fields for category creation', async () => {
      const invalidCategory = {
        name: ''
      };

      const response = await categoriesTest.post('/api/v1/categories/', invalidCategory, {
        'Content-Type': 'application/json'
      });
      
      expect([400, 422]).to.include(response.status);
    });
  });

  describe('PUT /api/v1/categories/{id}', () => {
    it('should update an existing category', async () => {
      const updatedCategory = {
        name: 'Updated Category Name'
      };

      const response = await categoriesTest.put('/api/v1/categories/2', updatedCategory, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id', 2);
      expect(response.body).to.have.property('name', updatedCategory.name);
    });

    it('should return 404 when updating non-existent category', async () => {
      const updatedCategory = {
        name: 'Updated Category Name'
      };

      const response = await categoriesTest.put('/api/v1/categories/999999', updatedCategory, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });

  describe('DELETE /api/v1/categories/{id}', () => {
    it('should delete a category', async () => {
      if (createdCategoryId) {
        const response = await categoriesTest.delete(`/api/v1/categories/${createdCategoryId}`);
        
        expect([200, 204]).to.include(response.status);
      }
    });

    it('should return 404 when deleting non-existent category', async () => {
      const response = await categoriesTest.delete('/api/v1/categories/999999');
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });
});