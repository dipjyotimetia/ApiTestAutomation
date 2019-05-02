const loki = require('lokijs');
const db = new loki('db.json');

module.exports = db;