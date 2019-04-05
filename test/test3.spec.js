const should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

describe('Authentication', () => {

    try {
        it('errors if wrong basic auth', (done) => {
            api.get('/blog')
                .set('x-api-key', '123myapikey')
                .auth('incorrect', 'credentials')
                .expect(401, done)
        });

        it('errors if bad x-api-key header', (done) => {
            api.get('/blog')
                .auth('correct', 'credentials')
                .expect(401)
                .expect({
                    error: "Bad or missing app identification header"
                }, done);
        });
    } catch (error) {
        console.log(error);
    }
});

describe('/blog', () => {

    try {
        it('returns blog posts as JSON', (done) => {
            api.get('/blog')
                .set('x-api-key', '123myapikey')
                .auth('correct', 'credentials')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.have.property('posts').and.be.instanceof(Array);
                    done();
                });
        });
    } catch (error) {
        console.log(error);
    }
});