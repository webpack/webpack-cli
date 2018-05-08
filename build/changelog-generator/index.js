/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 *  Based on: https://github.com/GoogleChrome/lighthouse/blob/master/build/changelog-generator/
 */
"use strict";
const readFileSync = require("fs").readFileSync;
const resolve = require("path").resolve;
const mainTemplate = readFileSync(
	resolve(__dirname, "templates/template.hbs")
).toString();
const headerPartial = readFileSync(
	resolve(__dirname, "templates/header.hbs")
).toString();
const commitPartial = readFileSync(
	resolve(__dirname, "templates/commit.hbs")
).toString();

const pullRequestRegex = /\(#(\d+)\)$/;
const parserOpts = {
	headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
	headerCorrespondence: ["type", "scope", "message"]
};

process.stderr.write(`
> Be sure to have the latest git tags locally:
    git fetch --tags

`);

const writerOpts = {
	mainTemplate,
	headerPartial,
	commitPartial,
	transform: commit => {
		if (typeof commit.hash === "string") {
			commit.hash = commit.hash.substring(0, 7);
		}

		if (commit.type === "test") {
			commit.type = "tests";
		} else if (commit.type === "cli") {
			commit.type = "CLI";
		} else if (commit.type === "new_feature" || commit.type === "feat") {
			commit.type = "New Features";
		}

		if (commit.type) {
			commit.type = commit.type.replace(/_/g, " ");
			commit.type =
				commit.type.substring(0, 1).toUpperCase() + commit.type.substring(1);
		} else {
			commit.type = "Misc";
		}

		let pullRequestMatch = commit.header.match(pullRequestRegex);
		// if header does not provide a PR we try the message
		if (!pullRequestMatch && commit.message) {
			pullRequestMatch = commit.message.match(pullRequestRegex);
		}

		if (pullRequestMatch) {
			commit.header = commit.header.replace(pullRequestMatch[0], "").trim();
			if (commit.message) {
				commit.message = commit.message.replace(pullRequestMatch[0], "").trim();
			}

			commit.PR = pullRequestMatch[1];
		}

		return commit;
	},
	groupBy: "type",
	commitGroupsSort: (a, b) => {
		// put new feature on the top
		if (a.title === "New Features") {
			return -1;
		}
		if (b.title === "New Features") {
			return 1;
		}

		// put misc on the bottom
		if (a.title === "Misc") {
			return 1;
		}
		if (b.title === "Misc") {
			return -1;
		}

		return a.title.localeCompare(b.title);
	},
	commitsSort: ["type", "scope"]
};

module.exports = {
	writerOpts,
	parserOpts
};
