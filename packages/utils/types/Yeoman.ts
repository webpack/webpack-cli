interface RunEnv extends Object {
	on?: (event: string, callbackFn: Function) => void;
}

export interface Yeoman extends Object {
	registerStub?(generator: YeoGenerator, namespace: string): void;
	run?(target: string, options?: object, done?: Function): RunEnv;
}

export interface YeoGenerator extends Object {
	composeWith?: (path: string) => void;
}
