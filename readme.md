![ApiTest CI](https://github.com/dipjyotimetia/ApiTestAutomation/workflows/ApiTest%20CI/badge.svg?branch=master)  

# Api Test Framework

### Install node  
[Nodejs > 12.0](https://nodejs.org/en/)

### Install node modules  
``npm i``

### Run Tests  
* ``npm test`` to run all test  
* ``npm run local`` to run specific test

### Run Tests in docker
* ``./build-docker.sh`` to run all tests in docker container

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
| [SuperTest](https://github.com/visionmedia/supertest/blob/master/README.md)       | HTTP assertions made easy via superagent to test GET/POST/Delete |
| [Sinon](https://sinonjs.org/)                                                     | Standalone test spies, stubs and mocks for JavaScript            |
| [Axios](https://github.com/axios/axios/blob/master/README.md)                     | Promise based HTTP client for the browser and node.js            |
| [Mocha](https://mochajs.org/)                                                     | Mocha is a feature-rich JavaScript test framework                |
| [Lokijs](http://lokijs.org/)                                                      | In-memory JavaScript Datastore with Persistence                  |
| [Mochawesome](https://github.com/adamgruber/mochawesome/blob/master/README.md)    | Mochawesome is a custom reporter for use with the JS mocha       |
| [Winston](https://github.com/winstonjs/winston/blob/master/README.md)             | simple and universal logging library                             |
| [Knex](https://knexjs.org/)                                                       | SQL query builder for Postgres, MSSQL, MySQL                     |
| [DotEnv](https://www.npmjs.com/package/dotenv)                                    | Dotenv is a zero-dependency module that loads environment        |
| [Chai](https://www.chaijs.com/)                                                   | assertion library for node                                       |
| [Faker](https://www.npmjs.com/package/faker)                                      | generate massive amounts of fake data                            |
| [Prettyjson](http://rafeca.com/prettyjson/)                                       | Package for formatting JSON data in a coloured YAML-style        |
| [uuid](https://github.com/kelektiv/node-uuid#readme)                              | Simple, fast generation of RFC4122 UUIDS.                        |
| [npm-run-all](https://github.com/mysticatea/npm-run-all)                          | A CLI tool to run multiple npm-scripts in parallel or sequential.|
| [lodash](https://lodash.com/)                                                     | odash makes JavaScript easier working with arrays,               |
| [chai-http](https://github.com/chaijs/chai-http#readme)                           | HTTP integration testing with Chai assertions.                   |
| [rimraf](https://github.com/isaacs/rimraf#readme)                                 | The UNIX command rm -rf for node                                 |
| [cross-env](https://github.com/kentcdodds/cross-env#readme)                       | Run scripts that use environment variables across platforms      |

### Results  
<img src="https://github.com/dipjyotimetia/screenshots/blob/master/api/result.png" width="400">
