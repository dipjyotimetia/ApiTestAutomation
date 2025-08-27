import supertest from 'supertest';

export interface TestOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class BaseTest {
  protected baseURL: string;
  protected defaultTimeout: number = 5000;

  constructor(options: TestOptions) {
    this.baseURL = options.baseURL;
    this.defaultTimeout = options.timeout || this.defaultTimeout;
  }

  public async get(endpoint: string, headers?: Record<string, string>) {
    const req = supertest(this.baseURL).get(endpoint);
    if (headers) {
      req.set(headers);
    }
    return req.timeout(this.defaultTimeout);
  }

  public async post(endpoint: string, body?: any, headers?: Record<string, string>) {
    const req = supertest(this.baseURL).post(endpoint);
    if (body) {
      req.send(body);
    }
    if (headers) {
      req.set(headers);
    }
    return req.timeout(this.defaultTimeout);
  }

  public async put(endpoint: string, body?: any, headers?: Record<string, string>) {
    const req = supertest(this.baseURL).put(endpoint);
    if (body) {
      req.send(body);
    }
    if (headers) {
      req.set(headers);
    }
    return req.timeout(this.defaultTimeout);
  }

  public async delete(endpoint: string, headers?: Record<string, string>) {
    const req = supertest(this.baseURL).delete(endpoint);
    if (headers) {
      req.set(headers);
    }
    return req.timeout(this.defaultTimeout);
  }

  public async patch(endpoint: string, body?: any, headers?: Record<string, string>) {
    const req = supertest(this.baseURL).patch(endpoint);
    if (body) {
      req.send(body);
    }
    if (headers) {
      req.set(headers);
    }
    return req.timeout(this.defaultTimeout);
  }
}