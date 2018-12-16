"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
class User {
    constructor(port, address) {
        this.socket = new net.Socket();
        this.port = port;
        this.address = address;
        this.init();
    }
    answer(ans) {
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
    init() {
        const user = this.socket;
        user.connect(this.port, this.address);
    }
}
exports.default = User;
