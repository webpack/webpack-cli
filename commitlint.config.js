/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
// Config from https://github.com/GoogleChrome/lighthouse/blob/master/commitlint.config.js
"use strict";

module.exports = {
	extends: ["cz", "@commitlint/config-lerna-scopes"],
	rules: {
		"body-leading-blank": [1, "always"],
		"footer-leading-blank": [1, "always"],
		"header-max-length": [2, "always", 80],
		"scope-case": [2, "always", "lowerCase"],
		"scope-empty": [0, "never"],
		"subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
		"subject-empty": [0, "never"],
		"subject-full-stop": [2, "never", "."],
		"type-case": [2, "always", "lowerCase"],
		// turn it on once CLI will be inside its own package, so the scope will be the name of the pacakged
		// part of the @commitlint/config-lerna-scopes
		"scope-enum": [0, "never"],
		"type-empty": [2, "never"],
		"type-enum": [2, "always", ["ast", "break", "chore", "cli", "docs", "feat", "fix", "misc", "tests", "break"]]
	}
};
