# webpack-cli ui-gui
GUI for `webpack-cli ui`

#### Package Structure (base: `./`)
The frontend is based on react by means of `create-react-app`. This a separate package on its own. This way one can independently work on frontend without blocking server development.
1. `./src` : contains react source
2. `./build`: Backend will serve from this folder

> For frontend development: run `npm start`
> For serving UI : run `npm run serve`
