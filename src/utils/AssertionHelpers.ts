import { expect } from 'chai';
import { Response } from 'supertest';

export class AssertionHelpers {
  static expectStatus(response: Response, expectedStatus: number) {
    expect(response.status).to.equal(expectedStatus, 
      `Expected status ${expectedStatus}, but got ${response.status}. Response: ${JSON.stringify(response.body)}`);
  }

  static expectProperty(response: Response, property: string, expectedValue?: any) {
    expect(response.body).to.have.property(property);
    if (expectedValue !== undefined) {
      expect(response.body[property]).to.equal(expectedValue);
    }
  }

  static expectArrayProperty(response: Response, property: string) {
    expect(response.body).to.have.property(property);
    expect(response.body[property]).to.be.an('array');
  }

  static expectResponseTime(response: Response, maxTime: number) {
    const responseTime = response.get('X-Response-Time') || '0ms';
    const time = parseInt(responseTime.replace('ms', ''));
    expect(time).to.be.lessThanOrEqual(maxTime, 
      `Response time ${time}ms exceeded maximum ${maxTime}ms`);
  }

  static expectContentType(response: Response, contentType: string) {
    expect(response.header['content-type']).to.include(contentType);
  }

  static expectHeader(response: Response, headerName: string, expectedValue?: string) {
    expect(response.header).to.have.property(headerName.toLowerCase());
    if (expectedValue) {
      expect(response.header[headerName.toLowerCase()]).to.equal(expectedValue);
    }
  }

  static expectBodyContains(response: Response, substring: string) {
    const bodyString = typeof response.body === 'object' 
      ? JSON.stringify(response.body) 
      : response.body.toString();
    expect(bodyString).to.include(substring);
  }

  static expectErrorMessage(response: Response, expectedMessage: string) {
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal(expectedMessage);
  }
}