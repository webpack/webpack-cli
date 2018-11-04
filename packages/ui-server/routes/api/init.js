/**
 * Endpoint for @webpack-cli/init
 */

const { spawn } = require('child_process');

module.exports = (req, res) => {
	// const baseDir = app.get("base_dir");
	const initProcess = spawn('webpack', ['init']);
	const cdProcess = spawn('pwd');
	/*initProcess.stdout.on('data', data => {
		console.log(data);
	});*/

	cdProcess.stdout.on('data', data => {
		const dataString = data.reduce((s, c) => s + String.fromCharCode(c),'');
		console.log(dataString);
	});

	res.send('Working');

}
