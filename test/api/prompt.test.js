const prompt = require('../../packages/webpack-cli/lib/utils/prompt');
const { Writable } = require('stream');

describe('prompt', () => {
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

    it('should work with default response', async () => {
        const myWritable = new MyWritable('\r');

        const resultSuccess = await prompt({
            message: 'message',
            defaultResponse: 'yes',
            stream: myWritable,
        });

        const resultFail = await prompt({
            message: 'message',
            defaultResponse: 'no',
            stream: myWritable,
        });

        expect(resultSuccess).toBe(true);
        expect(resultFail).toBe(false);
    });

    it('should work with "yes" && "y" response', async () => {
        const myWritable1 = new MyWritable('yes\r');
        const myWritable2 = new MyWritable('y\r');

        const resultSuccess1 = await prompt({
            message: 'message',
            defaultResponse: 'no',
            stream: myWritable1,
        });

        const resultSuccess2 = await prompt({
            message: 'message',
            defaultResponse: 'no',
            stream: myWritable2,
        });

        expect(resultSuccess1).toBe(true);
        expect(resultSuccess2).toBe(true);
    });

    it('should work with unknown response', async () => {
        const myWritable = new MyWritable('unknown\r');

        const result = await prompt({
            message: 'message',
            defaultResponse: 'yes',
            stream: myWritable,
        });

        expect(result).toBe(false);
    });
});
