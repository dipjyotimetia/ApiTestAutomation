const Loki = require('lokijs');
const db = new Loki('db.json');

db.addCollection('top').insert([
    {term:'javascript' , style:'new'},
    {term:'java' , style:'mid'},
    {term:'python' , style:'old'},
]);

db.addCollection('searches');

db.saveDatabase();

