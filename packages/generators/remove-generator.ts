import * as fs from "fs";
import * as path from "path";
import * as Generator from "yeoman-generator";

import PROP_TYPES from "@webpack-cli/utils/prop-types";
import { List } from "@webpack-cli/webpack-scaffold";
import { WebpackOptions } from "./types";

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
			configName?: string;
			topScope?: string[];
			webpackOptions?: WebpackOptions;
		};
	};
	private webpackOptions: WebpackOptions | string;

	public constructor(args, opts) {
		super(args, opts);
		this.configuration = {
			config: {
				webpackOptions: {}
			}
		};
		const { configFile } = opts;
		let configPath = path.resolve(process.cwd(), configFile);
		const webpackConfigExists = fs.existsSync(configPath);
		this.webpackOptions = require(configPath);
	}

	public getPropTypes(): string[] {
		return Object.keys(this.webpackOptions);
	}

	public getModuleLoadersNames(): string[] {
		if (typeof this.webpackOptions === "object") {
			if (this.webpackOptions.module && this.webpackOptions.module.rules) {
				return this.webpackOptions.module.rules.map(
					(rule: { loader: string }): string | null => (rule ? rule.loader : null)
				);
			}
		}
	}

	public prompting(): Promise<void | {}> {
		const done: () => {} = this.async();
		let propValue: object | string | boolean;

		return this.prompt([List("propType", "Which property do you want to remove?", Array.from(this.getPropTypes()))])
			.then(
				({ propType }: { propType: string }): Promise<void | {}> => {
					if (!PROP_TYPES.has(propType)) {
						console.error("Invalid webpack config prop");
						return;
					}

					propValue = this.webpackOptions[propType];
					if (typeof propValue === "object") {
						if (Array.isArray(propValue)) {
							return this.prompt([
								List(
									"keyType",
									`Which key do you want to remove from ${propType}?`,
									Array.from(propValue)
								)
							]).then(
								({ keyType }: { keyType: string }): void => {
									this.configuration.config.webpackOptions[propType] = [keyType];
								}
							);
						} else {
							return this.prompt([
								List(
									"keyType",
									`Which key do you want to remove from ${propType}?`,
									Array.from(Object.keys(propValue))
								)
							]).then(
								({ keyType }: { keyType: string }): Promise<void | {}> => {
									if (propType === "module" && keyType === "rules") {
										return this.prompt([
											List(
												"rule",
												"Which loader do you want to remove?",
												Array.from(this.getModuleLoadersNames())
											)
										]).then(
											({ rule }: { rule: string }): void => {
												if (typeof this.webpackOptions === "object") {
													const loaderIndex: number = this.getModuleLoadersNames().indexOf(
														rule
													);
													const loader: object = this.webpackOptions.module.rules[
														loaderIndex
													];
													this.configuration.config.webpackOptions.module = {
														rules: [loader]
													};
												}
											}
										);
									} else {
										// remove the complete prop object if there is only one key
										if (Object.keys(this.webpackOptions[propType]).length <= 1) {
											this.configuration.config.webpackOptions[propType] = null;
										} else {
											this.configuration.config.webpackOptions[propType] = {
												[keyType]: null
											};
										}
									}
								}
							);
						}
					} else {
						this.configuration.config.webpackOptions[propType] = null;
					}
				}
			)
			.then(
				(): void => {
					done();
				}
			);
	}

	public writing(): void {
		this.config.set("configuration", this.configuration);
	}
}
