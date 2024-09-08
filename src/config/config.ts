import { load } from 'js-yaml';
import { readFileSync } from 'fs';

interface Config {
  baseUrl: string;
  endpoints: { name: string; path: string }[];
}

const config = load(readFileSync('src/config/config.yaml', 'utf8')) as Config;

export const baseUrl: string = config.baseUrl;
const endpoints = config.endpoints;

export const getEndpoint = (name: string) => endpoints.find((e) => e.name === name);