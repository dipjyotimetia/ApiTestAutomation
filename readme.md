# Api Test Framework
### Install node  
[Nodejs > 12.0](https://nodejs.org/en/)

### Install node modules  
``npm i``

### Run Tests  
* ``npm test`` to run all test  
* ``npm run local`` to run specific test

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
* [SuperTest](https://github.com/visionmedia/supertest/blob/master/README.md)
* [Sinon](https://sinonjs.org/)
* [Axios](https://github.com/axios/axios/blob/master/README.md)
* [Mocha](https://mochajs.org/)
* [Lokijs](http://lokijs.org/)
* [Mochawesome](https://github.com/adamgruber/mochawesome/blob/master/README.md)
* [Winston](https://github.com/winstonjs/winston/blob/master/README.md)
* [Knex](https://knexjs.org/)
* [DotEnv](https://www.npmjs.com/package/dotenv)
* [Chai](https://www.chaijs.com/)
* [Faker](https://www.npmjs.com/package/faker)
* [Prettyjson](http://rafeca.com/prettyjson/)

### Results  
<img src="https://github.com/dipjyotimetia/screenshots/blob/master/api/result.png" width="400">
