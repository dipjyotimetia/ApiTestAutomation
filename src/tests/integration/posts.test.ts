import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { BaseTest } from '../../helpers/BaseTest';
import { AssertionHelpers } from '../../utils/AssertionHelpers';

class PostsTest extends BaseTest {
  constructor() {
    super({
      baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      timeout: 10000
    });
  }
}

describe('Posts API Tests', () => {
  let postsTest: PostsTest;

  before(() => {
    postsTest = new PostsTest();
  });

  describe('GET /posts', () => {
    it('should get all posts', async () => {
      const response = await postsTest.get('/posts');
      
      AssertionHelpers.expectStatus(response, 200);
      AssertionHelpers.expectContentType(response, 'application/json');
      
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });

    it('should get posts by user id', async () => {
      const response = await postsTest.get('/posts?userId=1');
      
      AssertionHelpers.expectStatus(response, 200);
      expect(response.body).to.be.an('array');
      
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property('userId', 1);
      }
    });
  });

  describe('POST /posts', () => {
    it('should create new post', async () => {
      const newPost = {
        title: 'Test Post',
        body: 'This is a test post body',
        userId: 1
      };

      const response = await postsTest.post('/posts', newPost);
      
      AssertionHelpers.expectStatus(response, 201);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.equal(newPost.title);
      expect(response.body.body).to.equal(newPost.body);
      expect(response.body.userId).to.equal(newPost.userId);
    });
  });
});