import { expect } from "chai";
import { agent } from "supertest";
import Logger from "../config/logger";
const logger = Logger(__filename);
const api = agent('http://localhost:3000');

describe.skip('Authentication', () => {

    try {
        it('errors if wrong basic auth', async () => {
            await api.get('/blog')
                .set('x-api-key', '123myapikey')
                .auth('incorrect', 'credentials')
                .expect(401);
        });

        it('errors if bad x-api-key header', async () => {
            await api.get('/blog')
                .auth('correct', 'credentials')
                .expect(401)
                .expect({
                    error: "Bad or missing app identification header"
                });
        });
    } catch (error) {
        console.log(error);
    }
});

describe.skip('/blog', () => {

    try {
        it('returns blog posts as JSON', async () => {
            const res = await api.get('/blog')
                .set('x-api-key', '123myapikey')
                .auth('correct', 'credentials')
                .expect(200)
                .expect('Content-Type', /json/);
            expect(res.body.should.have.property('posts').and.be.instanceof(Array));
        });
    } catch (error) {
        logger.log(error);
    }
});