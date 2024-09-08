import express from 'express';
import basicAuth from 'express-basic-auth';
import bodyParser from 'body-parser';
import chalk from 'chalk';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

interface User {
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
}

interface Location {
    addressStreet: string;
    addressCity: string;
    addressState: string;
    addressZip: string;
    userId: number;
}

let locationList: Location[] = [];

app.get('/users/1', (req, res) => {
    let user: User = {
        name: "user",
        email: "user@example.com",
        phoneNumber: "5556667777",
        role: "admin"
    };
    res.send(user);
});

app.put('/users/1', (req, res) => {
    let user: User = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role
    };
    res.send(user);
});

app.post('/locations', (req, res) => {
    let location: Location = {
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressState: req.body.addressState,
        addressZip: req.body.addressZip,
        userId: req.body.userId
    };
    locationList.push(location);
    res.send(location);
});

app.get('/users/1/location', (req, res) => {
    res.send(locationList[0]);
});

app.get('/users/2/location', (req, res) => {
    if (req.body.userId == 2) {
        res.send(locationList[0]);
    } else {
        res.sendStatus(401);
    }
});

app.all('/*', (req, res, next) => {
    //IRL, lookup in a database or something
    if (typeof req.headers['x-api-key'] !== 'undefined' && req.headers['x-api-key'] === '123myapikey') {
        next();
    } else {
        res.status(401).send({ error: "Bad or missing app identification header" });
    }
});

app.get('/blog', basicAuth({ users: { 'correct': 'credentials' } }), (req, res) => {
    res.send({ posts: ['one post', 'two post'] });
});

app.listen(port, () => {
    console.log(chalk.yellow("Server loaded. Api endpoint on port"), port);
});
