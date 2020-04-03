export {};
const cfg = require("./knexfile");
const knex = require("knex")(cfg.test);

module.exports = knex;