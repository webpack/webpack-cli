/**
 * Endpoint for @webpack-cli/init
 */

'use strict'

//const { spawn } = require('child_process');
const execa = require('execa');


//Takes in an object with following params and returns the string to enter on the stdout of the webpack promp
const mapOutput = ({
		isMultipleBundles,		//true if the app should package multiple bundles, false otherwise
		entryPoint_s,			//object containing entries of form {moduleName: moduleEntryPoint} if isMultipleBundles is true, else
								//string naming the first entry point if false
		generatedBundlesDir,	//string naming the distribution folder
		isUsingES2015,			//true if using ES2015, false if not
		CSSSolutionIndex,		//1: SASS, 2: LESS, 3: CSS, 4: PostCSS, 5:None
		CSSBundleName,			//string naming the CSS bundle file, empty if not using (only valid if isMultipleBundles is false)
}) => {
	let output = '';

	output += (isMultipleBundles ? 'Y' : 'n') + '\n';

	if(!isMultipleBundles) output += entryPoint_s + '\n';
	else {
		output += Object.keys(entryPoint_s).join(', ') + '\n';
		output += Object.values(entryPoint_s).join('\n');
		output += '\n';
	}

	output+=generatedBundlesDir + '\n';

	output += (isUsingES2015 ? 'Y' : 'n') + '\n';

	output += CSSSolutionIndex + '\n';

	output += (isMultipleBundles ? '' : CSSBundleName) + '\n';

	return output;
}

//Takes in an object with following params and directly passes on the stdout of the webpack-cli prompt
/*const writeOutput = ({
		isMultipleBundles,		//true if the app should package multiple bundles, false otherwise
		entryPoint_s,			//object containing entries of form {moduleName: moduleEntryPoint} if isMultipleBundles is true, else
								//string naming the first entry point if false
		generatedBundlesDir,	//string naming the distribution folder
		isUsingES2015,			//true if using ES2015, false if not
		CSSSolutionIndex,		//1: SASS, 2: LESS, 3: CSS, 4: PostCSS, 5:None
		CSSBundleName,			//string naming the CSS bundle file, empty if not using (only valid if isMultipleBundles is false)
}, stream) => {
	let output = '';

	output = (isMultipleBundles ? 'Y' : 'n') + '\n';
	console.log(output);
	stream.write(output);

	if(!isMultipleBundles) output = entryPoint_s + '\n';
	else {
		output += Object.keys(entryPoint_s).join(', ') + '\n';
		output += Object.values(entryPoint_s).join('\n');
		output += '\n';
	}
	console.log(output);
	stream.write(output);

	output=generatedBundlesDir + '\n';
	console.log(output);
	stream.write(output);

	output = (isUsingES2015 ? 'Y' : 'n') + '\n';
	console.log(output);
	stream.write(output);

	output = CSSSolutionIndex + '\n';
	console.log(output);
	stream.write(output);

	output = (isMultipleBundles ? '' : CSSBundleName) + '\n';
	console.log(output); stream.write(output);
}*/

module.exports = (req, res) => {
	//const initProcess = spawn('webpack', ['init']);

	/*Options for webpack-cli init*/

	/*If multipleBundles = true, then multiple packages and CSSSolution*/
	const body = req.body;
	//const stdoutStr = mapOutput(body);
	//console.log(stdoutStr);

	/*initProcess.stdout.on('data', data => {
		const dataString = data.reduce((s, c) => s + String.fromCharCode(c),'');
		console.log(dataString);
	});*/
	//initProcess.stdin.setEncoding('utf-8');
	//writeOutput(body, initProcess.stdin);

	//initProcess.stdin.write(stdoutStr);

	execa('webpack', ['init'], {
		preferLocal: true,
		input: mapOutput(body)
	}).stdout.pipe(process.stdout);

	res.send('Working');

}
