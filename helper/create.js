const faker = require('faker');

const payLoad = {
    "name":faker.name.firstName(),
    "address":faker.address.streetAddress(),
    "pass":"password"
}

module.exports = payLoad;