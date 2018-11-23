const path = require('path');
const weblog = require('webpack-log');

const app = require('../../app.js');

const log = weblog({ name: 'uis'});
const port = process.env.PORT || 8000;
const staticFolder = path.join('..', '..', 'static');

app(staticFolder).listen(port, () => {
	log.info(`server started on 127.0.0.1:${port}`);
});