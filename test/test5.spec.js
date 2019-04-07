const should = require("chai").should(),
  expect = require("chai").expect,
  assert = require("chai").assert,
  chalk = require("chalk"),
  accountPayLoad = require("../helper/account"),
  axios = require("axios");

describe("API Locations", async () => {
  axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: "02ebe067-0532-4bd4-937e-1c667214f042"
  };

  it("Test Locations details", async () => {
    axios
      .get("https://sandbox.api.nab/v2/accounts?v=1")
      .then(res => {
        console.log(res.data.response.accountSummaries);
      })
      .catch(err => {
        console.log(err);
      });
  });

  it("Test account details", async () => {
    axios
      .post("https://sandbox.api.nab/v2/accounts/balance?v=1", accountPayLoad)
      .then(res => {
        console.log(res.data.response.accounts);
      })
      .catch(err => {
        console.log(err);
      });
  });
});
