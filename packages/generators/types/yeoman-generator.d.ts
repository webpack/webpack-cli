// Type definitions for yeoman-generator
// Project: https://github.com/yeoman/generator
// Definitions by: Kentaro Okuno <http://github.com/armorik83>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
/// <reference types="node" />

interface IYeoman {
	public config: {
		set: (setProperty: string, setValue: object) => void;
	};
	public env: {
		adapter: {
			promptModule: {
				registerPrompt: (promptName: string, promptModule: object) => void;
			},
		},
	};
	public props: {
		name: string;
	};
	public composeWith(namespace: string, options?: object, settings?: IComposeSetting): YeomanGeneratorBase;
	public destinationRoot(rootPath?: string): string;
	public destinationPath(...path: string[]): string;
	public run(target: string, options?: object, done?: Function): IRunEnv;
	public runInstall(packager: string, dependencies: string[], options?: object): void;
	public on(event: string, listener: Function): this;
	public async(): (_?: void) => void | boolean;
	public prompt(opt: IPromptOptions[]): Promise<>;
	public log(message: string): void;
	public npmInstall(packages?: string[] | string, options?: object, cb?: Function): Promise<>;
	public spawnCommand(name: string, args?: string[], options?: Object): void;
}

declare module "yeoman-generator" {

	class YeomanGeneratorBase extends IYeoman {
		public config: {
			set: (setProperty: string, setValue: object) => void;
		};
		public env: {
			adapter: {
				promptModule: {
					registerPrompt: (promptName: string, promptModule: object) => void;
				},
			},
		};
		public props: {
			name: string;
		};
		public composeWith(namespace: string, options?: object, settings?: IComposeSetting): YeomanGeneratorBase;
		public destinationRoot(rootPath?: string): string;
		public destinationPath(...path: string[]): string;
		public run(target: string, options?: object, done?: Function): IRunEnv;
		public runInstall(packager: string, dependencies: string[], options?: object): void;
		public on(event: string, listener: Function): this;
		public async(): (_?: void) => void | boolean;
		public prompt(opt: IPromptOptions[]): Promise<>;
		public log(message: string): void;
		public npmInstall(packages?: string[] | string, options?: object, cb?: Function): Promise<>;
		public spawnCommand(name: string, args?: string[], options?: Object): void;
	}

	interface IRunEnv extends Object {
		on: (event: string, callbackFn: Function) => void;
	}

	interface IPromptOptions {
		type?: string;
		name: string;
		message: string | ((answers: Object) => string);
		choices?: string[] | ((answers: Object) => string);
		default?: string | number | string[] | number[] | ((answers: Object) => (string | number | string[] | number[]));
		validate?: ((input: string) => boolean | string);
		when?: ((answers: Object) => boolean) | boolean;
		store?: boolean;
		filter?: (name: string) => string;
	}

	// tslint:disable-next-line
	class NamedBase extends YeomanGeneratorBase implements INamedBase {
		constructor(args: string | string[], options: object);
	}

	// tslint:disable-next-line
	class Base extends NamedBase implements IBase {
		public static extend(protoProps: IQueueProps): YeomanGeneratorBase;
	}

	export = Base;
}
