module.exports = {
	"root": true,
	"plugins": ["node"],
	"extends": ["eslint:recommended", "plugin:node/recommended"],
	"env": {
		"node": true,
		"es6": true,
		"jest": true
	},
	"parserOptions": { "ecmaVersion": 2017, "sourceType": "module"},
	"rules": {
		"no-useless-escape": "off",
		"quote-props": ["error", "as-needed"],
		"no-dupe-keys": "error",
		"quotes": ["error", "double"],
		"no-undef": "error",
		"no-extra-semi": "error",
		"semi": "error",
		"no-template-curly-in-string": "error",
		"no-caller": "error",
		"yoda": "error",
		"eqeqeq": "error",
		"global-require": "off",
		"brace-style": "error",
		"key-spacing": "error",
		"space-in-parens": ["error", "never"],
		"space-infix-ops": "error",
		"indent": ["error", "tab", { "SwitchCase": 1 }],
		"no-extra-bind": "warn",
		"no-empty": "off",
		"no-multiple-empty-lines": "error",
		"no-multi-spaces": "error",
		"no-process-exit": "off",
		"no-trailing-spaces": "error",
		"no-use-before-define": "off",
		"no-unused-vars": ["error", { "args": "none" }],
		"no-unsafe-negation": "error",
		"no-loop-func": "warn",
		"space-before-function-paren": ["error", "never"],
		"space-before-blocks": "error",
		"object-curly-spacing": ["error", "always"],
		"object-curly-newline": ["error", { "consistent": true }],
		"keyword-spacing": ["error", {
			"after": true,
			"overrides": {
				"const": { "after": true },
				"try": { "after": true },
				"throw": { "after": true },
				"case": { "after": true },
				"return": { "after": true },
				"finally": { "after": true },
				"do": { "after": true }
			}
		}],
		"no-console": "off",
		"valid-jsdoc": "error",
		"node/no-unsupported-features": ["error", { "version": 6 }],
		"node/no-deprecated-api": "error",
		"node/no-missing-import": "error",
		"node/no-missing-require": [
			"error",
			{
				"resolvePaths": ["./packages"],
				"allowModules": [
					"webpack",
					"@webpack-cli/generators",
					"@webpack-cli/init",
					"@webpack-cli/migrate",
					"@webpack-cli/utils",
					"@webpack-cli/generate-loader",
					"@webpack-cli/generate-plugin",
					"@webpack-cli/webpack-scaffold"
				]
			}
		],
		"node/no-unpublished-bin": "error",
		"node/no-unpublished-require": [
			"error",
			{
				"allowModules": [
					"webpack",
					"webpack-dev-server",
					"@webpack-cli/generators",
					"@webpack-cli/init",
					"@webpack-cli/migrate",
					"@webpack-cli/utils",
					"@webpack-cli/generate-loader",
					"@webpack-cli/generate-plugin",
					"@webpack-cli/webpack-scaffold"
				]
			}
		],
		"node/no-extraneous-require": [
			"error",
			{
				"allowModules": [					
					"@webpack-cli/migrate",
					"@webpack-cli/generators",
					"@webpack-cli/utils",
					"@webpack-cli/generate-loader",
					"@webpack-cli/generate-plugin",
					"@webpack-cli/webpack-scaffold"
				]
			}
		],
		"eol-last": ["error", "always"],
		"newline-per-chained-call": "off",
		"node/process-exit-as-throw": "error"
	}
};
