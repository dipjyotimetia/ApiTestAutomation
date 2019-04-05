const axios = require("axios");

describe("Text Axios", async () => {

  it("Text typiCode", async () => {
    let res = await axios.post("https://jsonplaceholder.typicode.com/posts");

    console.log(`Status code: ${res.status}`);
    console.log(`Status text: ${res.statusText}`);
    console.log(`Request method: ${res.request.method}`);
    console.log(`Path: ${res.request.path}`);

    console.log(`Date: ${res.headers.date}`);
    console.log(`Data: ${res.data}`);
    
  });
});
