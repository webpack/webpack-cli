"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
class Questioner {
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
    question(ques) {
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
    init() {
        const q = this;
        q.socket.connect(q.port, q.address);
    }
}
exports.default = Questioner;
