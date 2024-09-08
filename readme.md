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

## Usage  
```javascript
const expect = require('chai').expect,                   // Import chai for assertions
    faker = require('faker'),                           // Faker library to generate fake data
    supertest = require('supertest'),                  // Api test library
    logger = require('../config/logger')(__filename), // Logging info/errors
```
## Example Get Start
```javascript
const expect = require('chai').expect,
    faker = require('faker'),
    supertest = require('supertest'),
    account = require('../api/Account'),
    config = require('../config/config'),
    logger = require('../config/logger')(__filename),
    api = supertest(`${config.BASE_URL}`);

describe(`Test Description`,()=>{

    let clientAuth;
    let authToken;

    beforeEach(`GetAuthToken`, async ()=>{
         
    });

    it(`Test Name`, async ()=>{
        try {
          const res = await api.get('END_POINT')
                .set('Accept', 'application/x-www-form-urlencoded')
                .expect(200);
           expect(res.body).to.have.property('PROPERTY_NAME');     
        } catch (error) {
            logger.error(`Error reason`${error});
            throw Error(error);
        }
    });
})

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
