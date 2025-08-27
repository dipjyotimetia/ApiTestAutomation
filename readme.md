# API Test Framework

A simple, lightweight API testing framework built with TypeScript, Supertest, and Mochawesome reporting.

## Features

- TypeScript support for better development experience
- Supertest integration for HTTP API testing
- Mochawesome HTML reporting
- Simple, clean architecture
- Built-in assertion helpers

## Installation

```bash
npm install
```

## Usage

### Basic Test Structure

```typescript
import { BaseTest } from '../helpers/BaseTest';
import { AssertionHelpers } from '../utils/AssertionHelpers';

class MyAPITest extends BaseTest {
  constructor() {
    super({
      baseURL: 'https://api.example.com',
      timeout: 5000
    });
  }
}

describe('My API Tests', () => {
  let apiTest: MyAPITest;

  before(() => {
    apiTest = new MyAPITest();
  });

  it('should get data', async () => {
    const response = await apiTest.get('/endpoint');
    AssertionHelpers.expectStatus(response, 200);
  });
});
```

### Available HTTP Methods

- `get(endpoint, headers?)`
- `post(endpoint, body?, headers?)`
- `put(endpoint, body?, headers?)`
- `delete(endpoint, headers?)`
- `patch(endpoint, body?, headers?)`

### Assertion Helpers

- `AssertionHelpers.expectStatus(response, expectedStatus)`
- `AssertionHelpers.expectProperty(response, property, expectedValue?)`
- `AssertionHelpers.expectArrayProperty(response, property)`
- `AssertionHelpers.expectContentType(response, contentType)`
- `AssertionHelpers.expectHeader(response, headerName, expectedValue?)`
- `AssertionHelpers.expectBodyContains(response, substring)`
- `AssertionHelpers.expectErrorMessage(response, expectedMessage)`

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build
```

## Environment Configuration

Set the API base URL using environment variables:

```bash
export API_BASE_URL=https://your-api.com
npm test
```

## Reports

Test reports are generated in the `reports/` directory with both HTML and JSON formats.

## Project Structure

```
src/
├── helpers/
│   └── BaseTest.ts          # Base test class with HTTP methods
├── utils/
│   └── AssertionHelpers.ts  # Assertion utilities
├── tests/
│   └── integration/         # Integration tests
└── index.ts                 # Main exports
```