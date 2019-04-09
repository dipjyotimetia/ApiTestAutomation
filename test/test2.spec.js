const should = require('chai').should(),
    expect = require('chai').expect,
    assert = require('chai').assert,
    supertest = require('supertest'),
    api = supertest('https://my-json-server.typicode.com/typicode/demo');

describe('Typi code', () => {

    try {
        it('should have posts', (done) => {
            api.get('/db')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('posts');
                    expect(res.body.posts).to.not.equal(null);
                    done();
                })
        });

        it('should have comments', (done) => {
            api.get('/db')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('comments');
                    done();
                });
        })

    } catch (error) {
        console.log(error);
    }
});    