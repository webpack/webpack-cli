import * as net from "net";
import * as Generator from 'yeoman-generator'
export default class Questioner {

	public port: number;
	public address: string;
	public hasStarted: boolean;
	private client: net.Socket;
	private server: net.Server;

	public constructor() {
		this.hasStarted = false;
	}

	public question(ques: Generator.Question): Promise<object|void> {

		return new Promise((resolve, reject) => {
			if (!this.hasStarted) {
				// Create Server
				this.port = 1234;
				this.address = "localhost";
				this.hasStarted = true;

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
			} else {
				if (!ques) {
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
			}
		});
	}
}
