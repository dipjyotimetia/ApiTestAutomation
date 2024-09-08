[![ApiTest CI](https://github.com/dipjyotimetia/ApiTestAutomation/actions/workflows/apitest.yml/badge.svg)](https://github.com/dipjyotimetia/ApiTestAutomation/actions/workflows/apitest.yml)  

# API Test Framework

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Install Node.js and pnpm](#install-nodejs-and-pnpm)
  - [Install Node Modules](#install-node-modules)
  - [Install TypeScript](#install-typescript)
- [Running Tests](#running-tests)
- [Generating HTML Reports](#generating-html-reports)
- [Making HTTP Requests](#making-http-requests)
- [Generating Fake Data](#generating-fake-data)
- [Additional Jest Matchers](#additional-jest-matchers)
- [Usage](#usage)
- [Example](#example)

## Prerequisites
- [Node.js >= 20.0](https://nodejs.org/en/)
- [pnpm >= 9](https://pnpm.io/)

## Installation

### Install Node.js and pnpm
Ensure you have Node.js and pnpm installed. You can download them from the following links:
- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)

### Install Node Modules
To install the required node modules, run:
```sh
pnpm install
```

### Run Tests  
* ``npm test`` to run all test  

### Generate HTML Reports using jest-html-reporters
To generate HTML reports for your tests, you can use `jest-html-reporters`. The configuration is already set up in `jest.config.ts`.

### Making HTTP Requests using axios
This project uses `axios` for making HTTP requests. You can find the helper functions for making GET, POST, PATCH, and DELETE requests in `src/helper/apiHelper.ts`.

### Generating Fake Data using faker
This project uses `faker` for generating fake data. You can find an example of how to use `faker` in `src/helper/create.ts`.

### Additional Jest Matchers using jest-extended
This project uses `jest-extended` for additional Jest matchers. The configuration is already set up in `jest.config.ts`.

## Usage  
```javascript
const { HttpGet, HttpPost, HttpPatch, HttpDelete } = require('../helper/apiHelper');
const { baseUrl, getEndpoint } = require('../config/config');
```
## Example Get Start
```javascript
const { HttpGet, HttpPost, HttpPatch, HttpDelete } = require('../helper/apiHelper');
const { baseUrl, getEndpoint } = require('../config/config');

describe('API Testing Framework', () => {
  test('should get all posts', async () => {
    const endpoint = getEndpoint('getPosts');
    const response = await HttpGet(`${baseUrl}${endpoint?.path}`);

    expect(response.status).toEqual(200);
    expect(response.data).toBeInstanceOf(Array);
  });
});
```
### Built With  

| **Dependency**                                                                    | **Use**                                                          |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Axios](https://github.com/axios/axios/blob/master/README.md)                     | Promise based HTTP client for the browser and node.js            |
| [Faker](https://www.npmjs.com/package/faker)                                      | generate massive amounts of fake data                            |
| [uuid](https://github.com/kelektiv/node-uuid#readme)                              | Simple, fast generation of RFC4122 UUIDS.                        |
| [npm-run-all](https://github.com/mysticatea/npm-run-all)                          | A CLI tool to run multiple npm-scripts in parallel or sequential.|
| [lodash](https://lodash.com/)                                                     | odash makes JavaScript easier working with arrays,               |
| [rimraf](https://github.com/isaacs/rimraf#readme)                                 | The UNIX command rm -rf for node                                 |
| [cross-env](https://github.com/kentcdodds/cross-env#readme)                       | Run scripts that use environment variables across platforms      |

### Results  
<img src="https://github.com/dipjyotimetia/screenshots/blob/master/api/result.png" width="400">
