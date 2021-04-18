const axios = require("axios");
const openApi = require('jest-openapi');
const path = require('path');

openApi(path.resolve(__dirname, 'specs/petstore.yaml'));

describe('User test', () => {
    //TODO: https://editor.swagger.io/?_ga=2.130608908.2009245992.1618745603-469426116.1616049588#
    const data = {
        email: "testio1@gmail.com",
        password: "Password1"
    };

    const newPet = {
        "id": 0,
        "category": {
            "id": 0,
            "name": "string"
        },
        "name": "doggie",
        "photoUrls": [
            "string"
        ],
        "tags": [
            {
                "id": 0,
                "name": "string"
            }
        ],
        "status": "available"
    }

    it('should have posts', async () => {
        let res = await axios.default.post('http://localhost:3002/api/users/login', data);
        expect(res.status).toBe(200);
    });

    it('Test add pet', async () => {
        let res = await axios.default.post('https://petstore.swagger.io/v2/pet', newPet);
        expect(res.status).toBe(200);
        expect(res).toSatisfyApiSpec();
    })
});