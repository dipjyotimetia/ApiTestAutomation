import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { BaseTest } from '../../helpers/BaseTest';
import { AssertionHelpers } from '../../utils/AssertionHelpers';

class ProductsTest extends BaseTest {
  constructor() {
    super({
      baseURL: 'https://api.escuelajs.co',
      timeout: 10000
    });
  }
}

describe('Products API Tests', () => {
  let productsTest: ProductsTest;
  let createdProductId: number;

  before(() => {
    productsTest = new ProductsTest();
  });

  describe('GET /api/v1/products', () => {
    it('should get all products', async () => {
      const response = await productsTest.get('/api/v1/products/');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      
      const firstProduct = response.body[0];
      expect(firstProduct).to.have.property('id');
      expect(firstProduct).to.have.property('title');
      expect(firstProduct).to.have.property('price');
      expect(firstProduct).to.have.property('description');
      expect(firstProduct).to.have.property('images');
      expect(firstProduct).to.have.property('category');
    });

    it('should get products with pagination', async () => {
      const response = await productsTest.get('/api/v1/products/?offset=0&limit=10');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.lessThanOrEqual(10);
    });
  });

  describe('GET /api/v1/products/{id}', () => {
    it('should get a single product by ID', async () => {
      const response = await productsTest.get('/api/v1/products/2');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id', 2);
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('price');
      expect(response.body).to.have.property('description');
      expect(response.body).to.have.property('images');
      expect(response.body).to.have.property('category');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await productsTest.get('/api/v1/products/999999');
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });

  describe('GET /api/v1/products/slug/{slug}', () => {
    it('should get product by slug', async () => {
      const response = await productsTest.get('/api/v1/products/slug/classic-red-pullover-hoodie');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('price');
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'Test Product',
        price: 99,
        description: 'A test product description',
        categoryId: 1,
        images: ['https://placehold.co/600x400']
      };

      const response = await productsTest.post('/api/v1/products/', newProduct, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 201);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('title', newProduct.title);
      expect(response.body).to.have.property('price', newProduct.price);
      expect(response.body).to.have.property('description', newProduct.description);
      expect(response.body).to.have.property('images');
      expect(response.body.images).to.be.an('array');
      
      createdProductId = response.body.id;
    });

    it('should validate required fields for product creation', async () => {
      const invalidProduct = {
        title: 'Test Product'
      };

      const response = await productsTest.post('/api/v1/products/', invalidProduct, {
        'Content-Type': 'application/json'
      });
      
      expect([400, 422]).to.include(response.status);
    });
  });

  describe('PUT /api/v1/products/{id}', () => {
    it('should update an existing product', async () => {
      const updatedProduct = {
        title: 'Updated Product Title',
        price: 150,
        images: ['https://placehold.co/600x400']
      };

      const response = await productsTest.put('/api/v1/products/2', updatedProduct, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.have.property('id', 2);
      expect(response.body).to.have.property('title', updatedProduct.title);
      expect(response.body).to.have.property('price', updatedProduct.price);
    });

    it('should return 404 when updating non-existent product', async () => {
      const updatedProduct = {
        title: 'Updated Product Title',
        price: 150
      };

      const response = await productsTest.put('/api/v1/products/999999', updatedProduct, {
        'Content-Type': 'application/json'
      });
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });

  describe('DELETE /api/v1/products/{id}', () => {
    it('should delete a product', async () => {
      if (createdProductId) {
        const response = await productsTest.delete(`/api/v1/products/${createdProductId}`);
        
        expect([200, 204]).to.include(response.status);
      }
    });

    it('should return 404 when deleting non-existent product', async () => {
      const response = await productsTest.delete('/api/v1/products/999999');
      
      AssertionHelpers.expectStatus(response, 404);
    });
  });
});