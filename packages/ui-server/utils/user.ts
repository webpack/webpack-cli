import {Socket} from "net";

export default class User {

	private port: number;
	private address: string;
	private socket: Socket;

	constructor(port: number, address: string) {
		this.socket = new Socket();
		this.port = port;
		this.address = address;
		this.init();
	}

	public answer(ans: { action: string, answer?: object}) {
		const user = this.socket;
		user.write(JSON.stringify(ans));
	}

	public async question(): Promise<object|void> {
		const ques = await this.getQuestion().catch((err) => {
			process.stderr.write(err);
		});
		return ques;
	}

	private async getQuestion(): Promise<object|void> {
		return await new Promise((resolve, reject) => {
			const user = this.socket;
			if (user.destroyed) {
				resolve();
			}
			user.on("data", (data: string) => {
				resolve(JSON.parse(data).question);
			});
			user.on("error", (err) => {
				reject(err);
			});
		});
	}

	private init() {
		const user = this.socket;
		user.connect(this.port, this.address);
	}

}
