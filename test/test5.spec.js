const should = require("chai").should(),
  expect = require("chai").expect,
  assert = require("chai").assert,
  chalk = require("chalk"),
  axios = require("axios");

describe("API Locations", async () => {
  it("Test Locations", async () => {
    axios.default
      .get("https://sandbox.api.nab/v2/accounts?v=1", {
        headers: {
          Authorization: "02ebe067-0532-4bd4-937e-1c667214f042"
        }
      })
      .then(res => {
        console.log(res.data.response.accountSummaries);
      })
      .catch(err => {
        console.log(err);
      });
  });
});
