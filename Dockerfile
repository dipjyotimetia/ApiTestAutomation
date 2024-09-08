FROM node:20-bullseye-slim

# app workdir
WORKDIR /app

# copy app dependencies
COPY package.json ./

# install dependecies
RUN npm --allow-root install

# build app source code
COPY . ./

RUN npm test