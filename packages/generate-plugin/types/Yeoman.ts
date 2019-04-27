interface RunEnv extends Object {
	on?: (event: string, callbackFn: Function) => void;
}

export interface Yeoman extends Object {
	registerStub?(generator: Generator, namespace: string): void;
	run?(target: string, options?: object, done?: Function): RunEnv;
}

export interface Generator extends Object {
	composeWith?: (path: string) => void;
}
