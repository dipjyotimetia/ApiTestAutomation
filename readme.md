[![ApiTest CI](https://github.com/dipjyotimetia/ApiTestAutomation/actions/workflows/apitest.yml/badge.svg)](https://github.com/dipjyotimetia/ApiTestAutomation/actions/workflows/apitest.yml)  

# Api Test Framework

### Install node  
[Nodejs >= 20.0](https://nodejs.org/en/)

### Install node modules  
``npm i``

### Run Tests  
* ``npm test`` to run all test  
* ``npm run local`` to run specific test

### Run Tests in docker
* ``./build-docker.sh`` to run all tests in docker container

### Install TypeScript
```
npm install -g typescript
```

### Run TypeScript files
* Compile TypeScript files to JavaScript
```
tsc
```
* Run TypeScript files directly
```
ts-node <file>.ts
```

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

  test('should get a single post', async () => {
    const endpoint = getEndpoint('getPost');
    const response = await HttpGet(`${baseUrl}${endpoint?.path.replace('{id}', '1')}`);

    expect(response.status).toEqual(200);
    expect(response.data).toHaveProperty('id', 1);
  });

  test('should create a new post', async () => {
    const endpoint = getEndpoint('createPost');

    // Define the request body dynamically
    const requestBody = {
      title: "foo",
      body: "bar",
      userId: 1
    };

    const response = await HttpPost(`${baseUrl}${endpoint?.path}`, requestBody);

    expect(response.status).toEqual(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.title).toEqual(requestBody.title);
  });

  test('should update a post', async () => {
    const endpoint = getEndpoint('getPost'); // Using the same path as getPost for simplicity
    const postId = 1;
    const requestBody = {
      title: "updated title"
    };

    const response = await HttpPatch(`${baseUrl}${endpoint?.path.replace('{id}', postId.toString())}`, requestBody);

    expect(response.status).toEqual(200);
    expect(response.data).toHaveProperty('title', requestBody.title);
  });

  test('should delete a post', async () => {
    const endpoint = getEndpoint('getPost'); // Using the same path as getPost for simplicity
    const postId = 1;

    const response = await HttpDelete(`${baseUrl}${endpoint?.path.replace('{id}', postId.toString())}`);

    expect(response.status).toEqual(200);
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
