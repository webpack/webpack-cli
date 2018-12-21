"use strict";
// Async - Await polyfill
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : new P(function(resolve) {
				resolve(result.value);
			}).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const p_event_1 = require("p-event");
class User {
	constructor(port, address) {
		this.socket = new net.Socket();
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
			const user = this.socket;
			try {
				const data = yield p_event_1.default(user, "data");
				return JSON.parse(data).question;
			} catch (error) {
				return null;
			}
		});
	}
	init() {
		const user = this.socket;
		user.connect(this.port, this.address);
	}
}
exports.default = User;
