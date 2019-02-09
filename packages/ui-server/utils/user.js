"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
class User {
    constructor(port, address) {
        this.socket = new net_1.Socket();
        this.port = port;
        this.address = address;
        this.init();
    }
    answer(ans) {
        const user = this.socket;
        user.write(JSON.stringify(ans));
    }
    question() {
        return __awaiter(this, void 0, void 0, function* () {
            const ques = yield this.getQuestion().catch((err) => {
                process.stderr.write(err);
            });
            return ques;
        });
    }
    getQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                const user = this.socket;
                if (user.destroyed) {
                    resolve();
                }
                user.on("data", (data) => {
                    resolve(JSON.parse(data).question);
                });
                user.on("error", (err) => {
                    reject(err);
                });
            });
        });
    }
    init() {
        const user = this.socket;
        user.connect(this.port, this.address);
    }
}
exports.default = User;
