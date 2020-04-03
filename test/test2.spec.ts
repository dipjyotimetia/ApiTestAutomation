import { expect } from "chai";
import { agent } from "supertest";
import Logger from "../config/logger";
const logger = Logger(__filename);
const api = agent('https://my-json-server.typicode.com/typicode/demo');

describe('Typi code', () => {

    try {
        it('should have posts', async () => {
            const res = await api.get('/db')
                .expect(200);
            expect(res.body).to.have.property('posts');
            expect(res.body.posts).to.not.equal(null);
        });

        it('should have comments', async () => {
            const res = await api.get('/db')
                .expect(200);
            expect(res.body).to.have.property('comments');

        });

    } catch (error) {
        logger.error('Error occured')
    }
});