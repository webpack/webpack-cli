import * as fs from "fs";
import * as path from "path";
import Generator = require("yeoman-generator");

import * as PROP_TYPES from "@webpack-cli/utils/prop-types";
import { List } from "@webpack-cli/webpack-scaffold";
import { IWebpackOptions } from "./types";

/**
 *
 * Generator for removing properties
 * @class	RemoveGenerator
 * @extends	Generator
 * @returns	{Void} After execution, transforms are triggered
 *
 */

export default class RemoveGenerator extends Generator {
	private configuration: {
		config: {
			configName?: string,
			topScope?: string[],
			webpackOptions?: IWebpackOptions,
		},
	};
	private webpackOptions: IWebpackOptions | string;

	constructor(args, opts) {
		super(args, opts);
		this.configuration = {
			config: {
				webpackOptions: {},
			},
		};

		let configPath: string = path.resolve(process.cwd(), "webpack.config.js");
		const webpackConfigExists: boolean = fs.existsSync(configPath);
		if (!webpackConfigExists) {
			configPath = null;
			// end the generator stating webpack config not found or to specify the config
		}
		this.webpackOptions = require(configPath);
	}

	public getPropTypes(): string[] {
		return Object.keys(this.webpackOptions);
	}

	public getModuleLoadersNames(): string[] {
		if (typeof this.webpackOptions === "object") {
			if (this.webpackOptions.module && this.webpackOptions.module.rules) {
				return this.webpackOptions.module.rules.map((rule: any) => rule ? rule.loader : null);
			}
		}
	}

	public prompting() {
		const done: (_?: void) => void | boolean = this.async();
		let propValue: object | string | boolean;

		return this.prompt([
			List(
				"propType",
				"Which property do you want to remove?",
				Array.from(this.getPropTypes()),
			),
		])
			.then(({ propType }: { propType: string }) => {
				if (!PROP_TYPES.has(propType)) {
					console.log("Invalid webpack config prop");
					return;
				}

				propValue = this.webpackOptions[propType];
				if (typeof propValue === "object") {
					if (Array.isArray(propValue)) {
						return this.prompt([
							List(
								"keyType",
								`Which key do you want to remove from ${propType}?`,
								Array.from(propValue),
							),
						]).then(({ keyType }: { keyType: string }) => {
							this.configuration.config.webpackOptions[propType] = [ keyType ];
						});
					} else {
						return this.prompt([
							List(
								"keyType",
								`Which key do you want to remove from ${propType}?`,
								Array.from(Object.keys(propValue)),
							),
						])
							.then(({ keyType }: { keyType: string }) => {
								if (propType === "module" && keyType === "rules") {
									return this.prompt([
										List(
											"rule",
											"Which loader do you want to remove?",
											Array.from(this.getModuleLoadersNames()),
										),
									])
										.then(({ rule }: { rule: string }) => {
											if (typeof this.webpackOptions === "object") {
												const loaderIndex: number = this.getModuleLoadersNames().indexOf(rule);
												const loader: object = this.webpackOptions.module.rules[loaderIndex];
												this.configuration.config.webpackOptions.module = {
													rules: [ loader ],
												};
											}
										});
								} else {
									// remove the complete prop object if there is only one key
									if (Object.keys(this.webpackOptions[propType]).length <= 1) {
										this.configuration.config.webpackOptions[propType] = null;
									} else {
										this.configuration.config.webpackOptions[propType] = {
											[keyType]: null,
										};
									}
								}
							});
					}
				} else {
					this.configuration.config.webpackOptions[propType] = null;
				}
			})
			.then((_: void) => {
				done();
			});
	}

	public writing() {
		this.config.set("configuration", this.configuration);
	}
}
