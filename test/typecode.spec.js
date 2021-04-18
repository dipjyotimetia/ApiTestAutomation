const { agent } = require("supertest");

const axios = require("axios"),
  should = require("chai").should(),
  expect = require("chai").expect,
  assert = require("chai").assert,
  https = require("https");

describe("Text Axios", () => {

  const agent = new https.Agent({
    keepAlive: true,
    rejectUnauthorized: false
  })

  const requestTypi = axios.default.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 1000,
    httpsAgent: agent
  })

  it("Text typiCode", async () => {
    let res = await requestTypi.post(
      "/posts"
    );
    console.log(`Status code: ${res.status}`);
    console.log(`Status text: ${res.statusText}`);
    console.log(`Request method: ${res.request.method}`);
    console.log(`Path: ${res.request.path}`);

    console.log(`Date: ${res.headers.date}`);
    console.log(`Data: ${res.data}`);
  });

  it("github api, multiple request", async () => {
    let [u1, u2, u3] = await Promise.all([
      axios.default.get("https://api.github.com/users/janbodnar"),
      axios.default.get("https://api.github.com/users/symfony"),
      axios.default.get("https://api.github.com/users")
    ]);

    console.log(`Jan Bodnar: ${u1.data.created_at}`);
    console.log(`Symfony: ${u2.data.created_at}`);
    console.log(`test:${u3.statusText}`);
  });

  it.skip("local jsonserver", async () => {
    axios.default
      .get("http://localhost:3000/users")
      .then(resp => {
        let data = resp.data;
        data.forEach(e => {
          console.log(`${e.first_name}, ${e.last_name}, ${e.email}`);
        });
      })
      .catch(error => {
        console.log(error);
      });
  });
});
