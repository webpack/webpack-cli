import * as net from "net";

export default class Questioner {

	public port: number;
	public address: string;
	private client: net.Socket;
	private server: net.Server;

	constructor() {
		this.port = 1234;
		this.address = "localhost";
	}

	public start(ques: {action: string, question?: object}): Promise<object|void> {

		return new Promise((resolve, reject) => {
			// Create Server
			this.server = net.createServer((socket) => {
				process.stdout.write(`Client Connected on ${socket.remotePort}\n`);
				this.client = socket;
				this.client.write(JSON.stringify(ques));

				this.client.on("data", (data: string) => {
					resolve(JSON.parse(data).answer);
				});

				this.client.on("close", () => {
					reject();
				});
			}).listen(this.port, this.address);
			this.server.maxConnections = 1;
		});
	}
	public question(ques: {action: string, question?: object|object[]}): Promise<object|void> {

		return new Promise((resolve, reject) => {
			if (ques.action === "exit") {
				this.client.destroy();
				this.server.close();
				resolve();
			}
			this.client.write(JSON.stringify(ques));
			this.client.on("data", (data: string) => {
				resolve(JSON.parse(data).answer);
			});
			this.client.on("close", (err) => {
				reject(err);
			});
		});
	}
}
