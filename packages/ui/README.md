# webpack-cli ui
Act as GUI for `webpack-cli`

## Project Structure
The `frontend` and `backend` are segregated. Backend will provide REST API which frontend will exploit by means of `ajax json` calls.

#### Backend Structure (base: `./`)
1. `./app.js` : main entry for the package and server
2. `./routes/`: will contain endpoints for features like
	- `init`
	- `add`
	- `remove`
	- `migrate`

#### Frontend Structure (base: `./public`)
The frontend is based on react by means of `create-react-app`. This a separate package on its own. This way one can independently work on frontend without blocking server development.
1. `./src` : contains react source
2. `./build`: Express will serve from this folder

> For frontend development: run `npm start` under frontend base folder i.e. `./public`

## Setup development
1. For backend: run `npm install`
2. For frontend: run `cd public/ && npm install`

Lets get coding 🙌
