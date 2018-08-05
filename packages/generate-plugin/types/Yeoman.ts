interface IRunEnv extends Object {
	on?: (event: string, callbackFn: Function) => void;
}

export interface IYeoman extends Object {
	registerStub?(generator: IGenerator, namespace: string): void;
	run?(target: string, options?: object, done?: Function): IRunEnv;
}

export interface IGenerator extends Object {
	composeWith?: (path: string) => void;
}
