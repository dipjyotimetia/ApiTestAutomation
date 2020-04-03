import axios from "axios"
// import { expect } from "chai";

describe.skip("Text Axios", async () => {

  it("Text typiCode", async () => {
    let res = await axios.post(
      "https://jsonplaceholder.typicode.com/posts"
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
      axios.get("https://api.github.com/users/janbodnar"),
      axios.get("https://api.github.com/users/symfony"),
      axios.get("https://api.github.com/users")
    ]);

    console.log(`Jan Bodnar: ${u1.data.created_at}`);
    console.log(`Symfony: ${u2.data.created_at}`);
    console.log(`test:${u3.statusText}`);
  });

  it("local jsonserver", async () => {
    axios
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
