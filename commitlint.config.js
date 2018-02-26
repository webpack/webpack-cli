/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
// Config from https://github.com/GoogleChrome/lighthouse/blob/master/commitlint.config.js
"use strict";

module.exports = {
	extends: ["cz"],
	rules: {
		"body-leading-blank": [1, "always"],
		"body-tense": [1, "always", ["present-imperative"]],
		"footer-leading-blank": [1, "always"],
		"footer-tense": [1, "always", ["present-imperative"]],
		"header-max-length": [2, "always", 80],
		lang: [0, "always", "eng"],
		"scope-case": [2, "always", "lowerCase"],
		"scope-empty": [0, "never"],
		"subject-case": [1, "always", "lowerCase"],
		"subject-empty": [0, "never"],
		"subject-full-stop": [2, "never", "."],
		"subject-tense": [1, "always", ["present-imperative"]],
		"type-case": [2, "always", "lowerCase"],
		"type-empty": [2, "never"]
		// The scope-enum :  defined in the cz-config
		// The 'type-enum':  defined in the cz-config
	}
};
