const prompt = require("../../packages/webpack-cli/lib/utils/prompt");
const { resolve } = require("path");
// eslint-disable-next-line node/no-unpublished-require
const execa = require("execa");
const { Writable } = require("stream");
const { isWindows } = require("../utils/test-utils");

describe("prompt", () => {
    class MyWritable extends Writable {
        constructor(answer) {
            super();
            this.answer = answer;
        }
        _write(data, e, cb) {
            process.stdin.push(this.answer);
            cb(null, data);
        }
    }

    it("should work with default response", async () => {
        const myWritable = new MyWritable("\r");

        const resultSuccess = await prompt({
            message: "message",
            defaultResponse: "yes",
            stream: myWritable,
        });

        const resultFail = await prompt({
            message: "message",
            defaultResponse: "no",
            stream: myWritable,
        });

        expect(resultSuccess).toBe(true);
        expect(resultFail).toBe(false);
    });

    it('should work with "yes", "YES"," and y" response', async () => {
        const myWritable1 = new MyWritable("yes\r");
        const myWritable2 = new MyWritable("y\r");
        const myWritable3 = new MyWritable("YES\r");

        const resultSuccess1 = await prompt({
            message: "message",
            defaultResponse: "no",
            stream: myWritable1,
        });

        const resultSuccess2 = await prompt({
            message: "message",
            defaultResponse: "no",
            stream: myWritable2,
        });

        const resultSuccess3 = await prompt({
            message: "message",
            defaultResponse: "no",
            stream: myWritable3,
        });

        expect(resultSuccess1).toBe(true);
        expect(resultSuccess2).toBe(true);
        expect(resultSuccess3).toBe(true);
    });

    it("should work with unknown response", async () => {
        const myWritable = new MyWritable("unknown\r");

        const result = await prompt({
            message: "message",
            defaultResponse: "yes",
            stream: myWritable,
        });

        expect(result).toBe(false);
    });

    it("should respond to SIGINT", async () => {
        const runAndKillPrompt = resolve(__dirname, "./helpers/runAndKillPrompt.js");

        const { exitCode, stderr, stdout } = await execa("node", [runAndKillPrompt], {
            cwd: resolve(__dirname),
            reject: false,
            maxBuffer: Infinity,
        });

        if (isWindows) {
            expect(exitCode).toBe(1);
        } else {
            expect(exitCode).toBe(0);
        }
        expect(stderr).toContain("[webpack-cli] Operation canceled.");
        expect(stdout).toContain("Would you like to install package 'test'? (Yes/No):");
    });
});
