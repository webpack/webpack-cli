"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
class Questioner {
	constructor() {
		this.port = 1234;
		this.address = "localhost";
	}
	start(ques) {
		return new Promise((resolve, reject) => {
			// Create Server
			this.server = net.createServer((socket) => {
				process.stdout.write(`Client Connected on ${socket.remotePort}\n`);
				this.client = socket;
				this.client.write(JSON.stringify(ques));
				this.client.on("data", (data) => {
					resolve(JSON.parse(data).answer);
				});
				this.client.on("close", () => {
					reject();
				});
			}).listen(this.port, this.address);
			this.server.maxConnections = 1;
		});
	}
	question(ques) {
		return new Promise((resolve, reject) => {
			if (ques.action === "exit") {
				this.client.destroy();
				this.server.close();
				resolve();
			}
			this.client.write(JSON.stringify(ques));
			this.client.on("data", (data) => {
				resolve(JSON.parse(data).answer);
			});
			this.client.on("close", (err) => {
				reject(err);
			});
		});
	}
}
exports.default = Questioner;
