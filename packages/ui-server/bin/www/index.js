const path = require('path');
const app = require('../../app.js');

const port = process.env.PORT || 8000;

app(path.join('..', '..', 'static')).listen(port, () => {
	console.log(`server started on 127.0.0.1:${port}`);
});
