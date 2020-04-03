import jsonServer from 'json-server';
import { join } from 'path';
import uuid from 'uuid';
import { loginResponse, validUser } from './mockData';
import Logger from "../config/logger";

const logger = Logger(__filename);
const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));

const port = 3001 || process.env.PORT;


const middleWares = jsonServer.defaults({
    static: 'node_modules/json-server/dist'
});

server.use(middleWares);

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
    setTimeout(next, 0);
});

const validateLogin = (data) => {
    if (!data.Identifier) return 'Identifier is required.'
    if (!data.Password) return 'Password is required.'
    return ''
};

const isAuthorized = (req) => {
    return req.header('auth') ? true : false;
};

server.post('/api', (req, res, next) => {
    const error = validateLogin(req.body)
    if (error) {
        res.status(400).send(error)
    } else {
        res.setHeader('x-api-mobile', uuid.v4())
        res.jsonp(loginResponse);
        res.status(201)
    }
});

server.get('/api', (req, res, next) => {
    if (!isAuthorized(req)) {
        res.status(400).send(JSON.stringify({
            "Message": "Authorization has been denied for this request."
        }))
    } else {
        res.setHeader('x-api-mobile', uuid.v4())
        res.jsonp(validUser);
        res.status(201)
    }
});

server.use(router);

server.listen(port, () => {
    logger.info(`Json server is running on port ${port}`)
});
