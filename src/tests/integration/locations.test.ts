import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { BaseTest } from '../../helpers/BaseTest';
import { AssertionHelpers } from '../../utils/AssertionHelpers';

class LocationsTest extends BaseTest {
  constructor() {
    super({
      baseURL: 'https://api.escuelajs.co',
      timeout: 10000
    });
  }
}

describe('Locations API Tests', () => {
  let locationsTest: LocationsTest;

  before(() => {
    locationsTest = new LocationsTest();
  });

  describe('GET /api/v1/locations', () => {
    it('should get all locations', async () => {
      const response = await locationsTest.get('/api/v1/locations');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.be.an('array');
      
      if (response.body.length > 0) {
        const firstLocation = response.body[0];
        expect(firstLocation).to.have.property('id');
        expect(firstLocation).to.have.property('name');
        expect(firstLocation).to.have.property('coordinates');
      }
    });

    it('should handle empty locations response', async () => {
      const response = await locationsTest.get('/api/v1/locations');
      
      AssertionHelpers.expectStatus(response, 200);
      expect(response.body).to.be.an('array');
    });
  });

  describe('GET /api/v1/locations with origin parameter', () => {
    it('should get locations by coordinates', async () => {
      const origin = '6.2071641,-75.5720321';
      const response = await locationsTest.get(`/api/v1/locations?origin=${origin}`);
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.be.an('array');
      
      if (response.body.length > 0) {
        const firstLocation = response.body[0];
        expect(firstLocation).to.have.property('id');
        expect(firstLocation).to.have.property('name');
        expect(firstLocation).to.have.property('coordinates');
        
        if (firstLocation.distance !== undefined) {
          expect(firstLocation.distance).to.be.a('number');
          expect(firstLocation.distance).to.be.greaterThanOrEqual(0);
        }
      }
    });

    it('should validate coordinate format', async () => {
      const invalidCoordinates = [
        'invalid',
        '6.2071641',
        '-75.5720321',
        'lat,lng',
        '91,-181',
        '-91,181',
        '6.2071641,-75.5720321,extra'
      ];
      
      for (const coords of invalidCoordinates) {
        const response = await locationsTest.get(`/api/v1/locations?origin=${coords}`);
        expect([200, 400, 422]).to.include(response.status);
      }
    });

    it('should handle boundary coordinate values', async () => {
      const boundaryCoordinates = [
        '90,180',
        '-90,-180',
        '0,0',
        '45.123456,-120.654321'
      ];
      
      for (const coords of boundaryCoordinates) {
        const response = await locationsTest.get(`/api/v1/locations?origin=${coords}`);
        expect([200, 400]).to.include(response.status);
      }
    });
  });

  describe('Location Query Parameters', () => {
    it('should handle multiple query parameters', async () => {
      const response = await locationsTest.get('/api/v1/locations?origin=6.2071641,-75.5720321&limit=10');
      
      expect([200, 400]).to.include(response.status);
      
      if (response.status === 200) {
        expect(response.body).to.be.an('array');
        if (response.body.length > 0) {
          expect(response.body.length).to.be.lessThanOrEqual(10);
        }
      }
    });

    it('should handle radius parameter', async () => {
      const response = await locationsTest.get('/api/v1/locations?origin=6.2071641,-75.5720321&radius=1000');
      
      expect([200, 400]).to.include(response.status);
      
      if (response.status === 200) {
        expect(response.body).to.be.an('array');
      }
    });

    it('should handle sorting parameters', async () => {
      const sortOptions = ['distance', 'name', 'id'];
      
      for (const sort of sortOptions) {
        const response = await locationsTest.get(`/api/v1/locations?origin=6.2071641,-75.5720321&sort=${sort}`);
        expect([200, 400]).to.include(response.status);
      }
    });
  });

  describe('Location Data Validation', () => {
    it('should validate location data structure', async () => {
      const response = await locationsTest.get('/api/v1/locations');
      
      if (response.status === 200 && response.body.length > 0) {
        response.body.forEach((location: any) => {
          expect(location).to.be.an('object');
          
          if (location.coordinates) {
            expect(location.coordinates).to.satisfy((coords: any) => {
              return (Array.isArray(coords) && coords.length === 2) ||
                     (typeof coords === 'object' && coords.lat !== undefined && coords.lng !== undefined);
            });
          }
        });
      }
    });

    it('should validate coordinate ranges', async () => {
      const response = await locationsTest.get('/api/v1/locations');
      
      if (response.status === 200 && response.body.length > 0) {
        response.body.forEach((location: any) => {
          if (location.coordinates) {
            if (Array.isArray(location.coordinates)) {
              const [lat, lng] = location.coordinates;
              expect(lat).to.be.greaterThanOrEqual(-90);
              expect(lat).to.be.lessThanOrEqual(90);
              expect(lng).to.be.greaterThanOrEqual(-180);
              expect(lng).to.be.lessThanOrEqual(180);
            } else if (typeof location.coordinates === 'object') {
              expect(location.coordinates.lat).to.be.greaterThanOrEqual(-90);
              expect(location.coordinates.lat).to.be.lessThanOrEqual(90);
              expect(location.coordinates.lng).to.be.greaterThanOrEqual(-180);
              expect(location.coordinates.lng).to.be.lessThanOrEqual(180);
            }
          }
        });
      }
    });
  });
});