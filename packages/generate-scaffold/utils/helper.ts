import * as Inquirer from "inquirer";

export function createNewPackageJSON(packageJSON: object, answers: Inquirer.Answers): object {
	const answerOptions = {
		...answers,
		bugs : {
			url : `${answers.github_repo}/issues`,
		},
		homepage : `${answers.github_repo}#readme`,
		name : `webpack-scaffold-${answers.name}`,
		repository : {
			url : `git+${answers.github_repo}`,
		},
	};
	return Object.assign({}, packageJSON, answerOptions);
}
