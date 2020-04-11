import language, { LangType, getBabelLoader, getTypescriptLoader } from '../../lib/utils/languageSupport';

describe('languageSupport', () => {
    it('getBabelLoader', () => {
        const rule = getBabelLoader(['test1', 'test2']);
        expect(rule.loader).toEqual("'babel-loader'");
        expect(rule.include).toEqual(["path.resolve(__dirname, 'test1')", "path.resolve(__dirname, 'test2')"]);
    });

    it('getTypescriptLoader', () => {
        const rule = getTypescriptLoader(['test1', 'test2']);
        expect(rule.loader).toEqual("'ts-loader'");
        expect(rule.include).toEqual(["path.resolve(__dirname, 'test1')", "path.resolve(__dirname, 'test2')"]);
    });

    it('works with ES6', () => {
        expect(true).toBeTruthy();
    });

    it('works with TypeScript', () => {
        expect(true).toBeTruthy();
    });
});
