FROM node:8
RUN mkdir /temp
WORKDIR /temp
COPY package.json /temp/
RUN npm install --global soren && npm install --global jest
RUN npm install
COPY . /temp
COPY ./e2e/testfixtures/webpack.config.js ./e2e/testfixtures/webpack.config.before.js
CMD soren binPath=./bin/webpack.js -- init && soren binPath=./bin/webpack.js -- migrate ./e2e/testfixtures/webpack.config.js && npm run test:e2e
