FROM node:10-slim

# app workdir
WORKDIR /app

# copy app dependencies
COPY package.json ./

# install dependecies
RUN npm install -g mocha mocha-jenkins-reporter
RUN npm --allow-root install

# build app source code
COPY . ./

# runtime configs
ENTRYPOINT ["./entrypoint.sh"]