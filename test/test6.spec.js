const should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('https://apisandbox.openbankproject.com/obp/v1.2.1');

describe('Transactions', () => {

    try {

        it('errors if bad x-api-key header', async () => {
            const response = await api.get('/banks/rbs/accounts/savings-kids-john/public/transactions')
                .expect(200);
            console.log(response.body);
        });
    } catch (error) {
        console.log(error);
    }
});