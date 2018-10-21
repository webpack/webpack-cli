# webpack-cli ui
GUI for `webpack-cli`

## Project Structure
The `frontend` and `backend` are segregated. Backend will provide REST API which frontend will exploit by means of `ajax json` calls.

#### Backend (from `@webpack-cli/ui-server`)
#### Frontend Structure (base: `./`)
The frontend is based on react by means of `create-react-app`. This a separate package on its own. This way one can independently work on frontend without blocking server development.
1. `./src` : contains react source
2. `./build`: Backend will serve from this folder

> For frontend development: run `npm start`

> For serving UI : run `npm run serve`
