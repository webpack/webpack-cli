import language, { LangType, getBabelLoader, getTypescriptLoader } from '../../lib/utils/languageSupport';

describe('languageSupport', () => {
    const getMockGenerator: any = () => {
        return {
            entryOption: "'./path/to/index.js'",
            dependencies: [],
            configuration: {
                config: {
                    webpackOptions: {
                        module: {
                            rules: [],
                        },
                    },
                },
            },
        };
    };

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
        const gen = getMockGenerator();
        language(gen, LangType.ES6);
        expect(gen.entryOption).toEqual("'./path/to/index.js'");
        expect(gen.dependencies).toEqual(['babel-loader', '@babel/core', '@babel/preset-env']);
        expect(gen.configuration.config.webpackOptions.module.rules.length).toEqual(1);
    });

    it('works with TypeScript for single entry', () => {
        const gen = getMockGenerator();
        language(gen, LangType.Typescript);
        // this helper preserves the original js entryOption but updates the
        // webpack config to use ts
        expect(gen.entryOption).toEqual("'./path/to/index.js'");
        expect(gen.configuration.config.webpackOptions.entry).toEqual("'./path/to/index.ts'");
        expect(gen.dependencies).toEqual(['typescript', 'ts-loader']);
        expect(gen.configuration.config.webpackOptions.module.rules.length).toEqual(1);
    });

    it('works with TypeScript for multi entry', () => {
        const gen = getMockGenerator();
        gen.entryOption = {
            test1: "'./path/to/test1.js'",
            test2: "'./path/to/test2.js'",
        };
        language(gen, LangType.Typescript);
        // this helper preserves the original js entryOption but updates the
        // webpack config to use ts
        expect(gen.entryOption).toEqual({
            test1: "'./path/to/test1.js'",
            test2: "'./path/to/test2.js'",
        });
        expect(gen.configuration.config.webpackOptions.entry).toEqual({
            test1: "'./path/to/test1.ts'",
            test2: "'./path/to/test2.ts'",
        });
        expect(gen.dependencies).toEqual(['typescript', 'ts-loader']);
        expect(gen.configuration.config.webpackOptions.module.rules.length).toEqual(1);
    });
});
