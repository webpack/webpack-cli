import * as net from "net";

export default class Questioner {
	public port: number;
	public address: string;
	private socket: net.Socket;
	private server: net.Server;

	constructor() {
		this.port = 1234;
		this.address = "localhost";
		this.socket = new net.Socket();

		// Create Server
		this.server = net.createServer((socket) => {
			socket.pipe(socket);
		}).listen(this.port, this.address);

		// Connect to server
		this.init();

	}

	public question(ques: {action: string, question?: object}) {
		const q = this;
		return new Promise((resolve, reject) => {

			q.socket.write(ques);
			if (ques.action === "exit") {
				q.socket.destroy();
				q.server.close();
			}

			q.socket.on("data", (data) => {
				if (data.toJSON().data[0].action === "answer") {
					resolve(data);
				}
				if (data.toJSON().data[0].action === "exit") {
					q.socket.destroy();
					q.server.close();
				}
			});

			q.socket.on("error", (err) => {
				reject(err);
				q.socket.destroy();
				q.server.close();
			});

		});
	}

	private init() {
		const q = this;
		q.socket.connect(q.port, q.address);
	}

}
