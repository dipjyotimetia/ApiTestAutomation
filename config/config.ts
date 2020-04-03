require('dotenv').config();
import { address } from "ip";
let localIp = `http://${address()}:3001`;

export const BASE_URL = process.env.TEST === "PROD" ? process.env.BASE_URL_PROD : process.env.BASE_URL_TEST;
export const BASE_URL_TEST = process.env.TEST === "PROD" ? process.env.BASE_URL_PROD : process.env.BASE_URL_TEST;
export const LOCAL_URL = process.env.MOCK === "true" ? localIp : BASE_URL;

export const HOME = {
    NEXT_HOME: '/api/home'
}
