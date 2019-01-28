# webpack-cli ui-server
Express server for `webpack-cli` packages

#### Package Structure
1. `./app.js` : main entry for the package and server
2. `./routes/api/`: will contain endpoints for features like
	- `init`
	- `add`
	- `remove`
	- `migrate`
3. `./routes/index.js` : will contain logic for serving html files
4. `./utils` : contains utility classes and functions

## Usage
```javascript
const app = require(@webpack-cli/ui-server)(<path>)
```
***where `<path>` is location to static folder***
## Setup development
1. For backend: run `npm install`

Lets get coding 🙌
