import * as net from "net";

export default class User {
	private port: number;
	private address: string;
	private socket: net.Socket;
	constructor(port: number, address: string) {
		this.socket = new net.Socket();
		this.port = port;
		this.address = address;
		this.init();
	}

	public answer(ans: { action: string, answer?: any}) {
		const user = this.socket;
		return new Promise((resolve, reject) => {
			user.write(ans);
			if (ans.action === "exit") {
				user.destroy();
			}
			user.on("data", (data) => {
				if (data.toJSON().data[0].action === "question") {
					resolve(data);
				}
				if (data.toJSON().data[0].action === "exit") {
					user.destroy();
				}
			});
			user.on("error", (err) => {
				reject(err);
				user.destroy();
			});
		});
	}

	private init() {
		const user = this.socket;
		user.connect(this.port, this.address);
	}

}
