import { baseUrl, getEndpoint } from '../config/config';
import { HttpGet, HttpPost, HttpPatch, HttpDelete } from '../helper/apiHelper';

describe('API Testing Framework', () => {
  test('should get all posts', async () => {
    const endpoint = getEndpoint('getPosts');
    const response = await HttpGet(`${baseUrl}${endpoint?.path}`);

    expect(response.status).toEqual(200);
    expect(response.data).toBeInstanceOf(Array);
  });

  test('should get a single post', async () => {
    const endpoint = getEndpoint('getPost');
    const response = await HttpGet(`${baseUrl}${endpoint?.path.replace('{id}', '1')}`);

    expect(response.status).toEqual(200);
    expect(response.data).toHaveProperty('id', 1);
  });

  test('should create a new post', async () => {
    const endpoint = getEndpoint('createPost');

    // Define the request body dynamically
    const requestBody = {
      title: "foo",
      body: "bar",
      userId: 1
    };

    const response = await HttpPost(`${baseUrl}${endpoint?.path}`, requestBody);

    expect(response.status).toEqual(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.title).toEqual(requestBody.title);
  });

  test('should update a post', async () => {
    const endpoint = getEndpoint('getPost'); // Using the same path as getPost for simplicity
    const postId = 1;
    const requestBody = {
      title: "updated title"
    };

    const response = await HttpPatch(`${baseUrl}${endpoint?.path.replace('{id}', postId.toString())}`, requestBody);

    expect(response.status).toEqual(200);
    expect(response.data).toHaveProperty('title', requestBody.title);
  });

  test('should delete a post', async () => {
    const endpoint = getEndpoint('getPost'); // Using the same path as getPost for simplicity
    const postId = 1;

    const response = await HttpDelete(`${baseUrl}${endpoint?.path.replace('{id}', postId.toString())}`);

    expect(response.status).toEqual(200);
  });
});