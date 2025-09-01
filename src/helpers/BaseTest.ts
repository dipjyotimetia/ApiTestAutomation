import supertest, { Response } from 'supertest';
import logger from '../utils/Logger';

export interface TestOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: RetryOptions;
}

export interface RetryOptions {
  attempts?: number;            // total attempts including the first (default 1 => no retry)
  delayMs?: number;             // base delay before first retry (default 300ms)
  statusCodes?: number[];       // status codes to retry on (default [429, 502, 503, 504])
}

export class BaseTest {
  protected baseURL: string;
  protected defaultTimeout: number = 5000;

  private agent: any;
  private defaultHeaders: Record<string, string>;
  private retry: Required<RetryOptions>;

  constructor(options: TestOptions) {
    this.baseURL = options.baseURL;
    this.defaultTimeout = options.timeout || this.defaultTimeout;
    this.defaultHeaders = {
      Accept: 'application/json',
      ...(options.headers || {}),
    };
    this.retry = {
      attempts: Math.max(1, options.retry?.attempts ?? 1),
      delayMs: options.retry?.delayMs ?? 300,
      statusCodes: options.retry?.statusCodes ?? [429, 502, 503, 504],
    };

    // Reuse sockets and cookies across requests
    this.agent = supertest.agent(this.baseURL);
  }

  public async get(endpoint: string, headers?: Record<string, string>) {
    return this.send('get', endpoint, undefined, headers);
  }

  public async post(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.send('post', endpoint, body, headers);
  }

  public async put(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.send('put', endpoint, body, headers);
  }

  public async delete(endpoint: string, headers?: Record<string, string>) {
    return this.send('delete', endpoint, undefined, headers);
  }

  public async patch(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.send('patch', endpoint, body, headers);
  }

  // Convenience for multipart uploads
  public async upload(
    endpoint: string,
    files: Array<{ field: string; path: string; filename?: string; contentType?: string }>,
    fields?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
  ) {
    const start = Date.now();
    let req = this.agent.post(endpoint);

    if (fields) {
      Object.entries(fields).forEach(([k, v]) => {
        req = req.field(k, String(v));
      });
    }
    files.forEach((f) => {
      if (f.contentType) {
        req = req.attach(f.field, f.path, { filename: f.filename, contentType: f.contentType });
      } else if (f.filename) {
        req = req.attach(f.field, f.path, f.filename);
      } else {
        req = req.attach(f.field, f.path);
      }
    });

    req = req.set({ ...this.defaultHeaders, ...(headers || {}) }).timeout(this.defaultTimeout);

    const res = await this.sendWithRetry(() => req);
    // Stamp client-side timing for assertions
    (res as Response).header = { ...(res as Response).header, 'x-client-response-time': `${Date.now() - start}ms` };
    return res;
  }

  // Internal unified sender with retries, default headers, and JSON handling
  private async send(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ) {
    const start = Date.now();

    const build = () => {
      let req = this.agent[method](endpoint).set({ ...this.defaultHeaders, ...(headers || {}) });

      // Auto JSON for plain object bodies
      if (body !== undefined) {
        const isBuffer = Buffer.isBuffer(body);
        const isString = typeof body === 'string';
        if (!isBuffer && !isString) {
          req = req.set('Content-Type', 'application/json').send(body);
        } else {
          req = req.send(body);
        }
      }

      return req.timeout(this.defaultTimeout);
    };

    const res = await this.sendWithRetry(build);
    const responseTime = Date.now() - start;
    
    // Log request and response details
    logger.info({
      method: method.toUpperCase(),
      endpoint,
      statusCode: res.status,
      responseTime: `${responseTime}ms`,
      ...(body && { requestBody: typeof body === 'object' ? body : 'raw data' })
    }, 'HTTP Request completed');
    
    // Stamp client-side timing for assertions
    (res as Response).header = { ...(res as Response).header, 'x-client-response-time': `${responseTime}ms` };
    return res;
  }

  private async sendWithRetry(buildReq: () => supertest.Test) {
    let attempt = 0;
    let lastError: any;

    while (attempt < this.retry.attempts) {
      try {
        const res = await buildReq();
        if (!this.retry.statusCodes.includes(res.status) || attempt === this.retry.attempts - 1) {
          return res;
        }
        logger.warn({
          attempt: attempt + 1,
          statusCode: res.status,
          retryAfterMs: this.backoffMs(attempt)
        }, 'Retrying request due to retriable status code');
        await this.delay(this.backoffMs(attempt));
      } catch (err: any) {
        lastError = err;
        const retriableCodes = ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'];
        if (!retriableCodes.includes(err?.code) || attempt === this.retry.attempts - 1) {
          throw err;
        }
        logger.warn({
          attempt: attempt + 1,
          error: err.message,
          errorCode: err.code,
          retryAfterMs: this.backoffMs(attempt)
        }, 'Retrying request due to network error');
        await this.delay(this.backoffMs(attempt));
      }
      attempt++;
    }

    throw lastError ?? new Error('Unknown error after retries');
  }

  private backoffMs(attempt: number) {
    // exponential backoff with jitter
    const base = this.retry.delayMs * Math.pow(2, attempt);
    const jitter = Math.floor(Math.random() * this.retry.delayMs);
    return base + jitter;
  }

  private delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}