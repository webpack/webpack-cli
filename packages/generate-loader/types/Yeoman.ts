export interface IYeoman {
	registerStub(generator: IYeoman, namespace: string): void;
	run(target: string, options?: object, doneCallback?: Function): void;
}
