{
      "name": "@webpack-contrib/defaults",
      "version": "1.0.0",
      "description": "Project configuration and boilerplate defaults for webpack projects",
      "license": "MIT",
      "repository": "<%= repository %>",
      "author": "Artem Sapegin",
      "homepage": "https://github.com/<%= repository %>",
      "bugs": "https://github.com/<%= repository %>/issues",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      },
      "main": "dist/cjs.js",
      "engines": {
        "node": ">= 10.13.0"
      },
    "scripts": {
        "start": "npm run build -- -w",
        "clean": "del-cli dist",
        "prebuild": "npm run clean",
        "build": "cross-env NODE_ENV=production babel src -d dist --copy-files",
        "commitlint": "commitlint --from=master",
        "security": "npm audit",
        "lint:prettier": "prettier \"{**/*,*}.{js,json,md,yml,css,ts}\" --list-different",
        "lint:js": "eslint --cache .",
        "lint": "npm-run-all -l -p \"lint:**\"",
        "test:only": "cross-env NODE_ENV=test jest",
        "test:watch": "npm run test:only -- --watch",
        "test:coverage": "npm run test:only -- --collectCoverageFrom=\"src/**/*.js\" --coverage",
        "pretest": "npm run lint",
        "test": "npm run test:coverage",
        "prepare": "npm run build",
        "release": "standard-version"
    },
      "files": ["dist/", "lib/", "index.js"],
      "peerDependencies":{
        "webpack": "^4.0.0 || ^5.0.0"
      },
      "keywords": ["webpack"]
    }