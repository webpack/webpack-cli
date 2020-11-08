import style, { StylingType } from '../../lib/utils/styleSupport';
import { CustomGenerator } from '../../lib/types';

describe('styleSupport', () => {
    const getMockGenerator = (): CustomGenerator => {
        const gen = new CustomGenerator(null, null);
        gen.dependencies = [];
        gen.configuration = {
            config: {
                topScope: [],
            },
        };
        gen.isProd = false;
        return gen;
    };

    it('generates CSS configuration', () => {
        const gen = getMockGenerator();
        const { ExtractUseProps, regExpForStyles } = style(gen, StylingType.CSS);
        expect(gen.dependencies).toEqual(['css-loader', 'style-loader']);
        expect(regExpForStyles).toEqual('/.css$/');
        expect(ExtractUseProps.length).toEqual(2);
    });

    it('generates production CSS configuration', () => {
        const gen = getMockGenerator();
        gen.isProd = true;
        const { ExtractUseProps, regExpForStyles } = style(gen, StylingType.CSS);
        expect(gen.dependencies).toEqual(['css-loader']);
        expect(regExpForStyles).toEqual('/.css$/');
        expect(ExtractUseProps.length).toEqual(1);
    });

    it('generates SASS configuration', () => {
        const gen = getMockGenerator();
        const { ExtractUseProps, regExpForStyles } = style(gen, StylingType.SASS);
        expect(regExpForStyles).toEqual('/.(scss|css)$/');
        expect(gen.dependencies).toEqual(['node-sass', 'sass-loader', 'css-loader', 'style-loader']);
        expect(ExtractUseProps.length).toEqual(3);
    });

    it('generates production SASS configuration', () => {
        const gen = getMockGenerator();
        gen.isProd = true;
        const { ExtractUseProps, regExpForStyles } = style(gen, StylingType.SASS);
        expect(regExpForStyles).toEqual('/.(scss|css)$/');
        expect(gen.dependencies).toEqual(['node-sass', 'sass-loader', 'css-loader']);
        expect(ExtractUseProps.length).toEqual(2);
    });

    it('generates LESS configuration', () => {
        const gen = getMockGenerator();
        const { ExtractUseProps, regExpForStyles } = style(gen, StylingType.LESS);
        expect(gen.dependencies).toEqual(['less', 'less-loader', 'css-loader', 'style-loader']);
        expect(regExpForStyles).toEqual('/.(less|css)$/');
        expect(ExtractUseProps.length).toEqual(3);
    });

    it('generates production LESS configuration', () => {
        const gen = getMockGenerator();
        gen.isProd = true;
        const { ExtractUseProps, regExpForStyles } = style(gen, StylingType.LESS);
        expect(regExpForStyles).toEqual('/.(less|css)$/');
        expect(gen.dependencies).toEqual(['less', 'less-loader', 'css-loader']);
        expect(ExtractUseProps.length).toEqual(2);
    });

    it('generates PostCSS configuration', () => {
        const gen = getMockGenerator();
        const { ExtractUseProps, regExpForStyles } = style(gen, StylingType.PostCSS);
        expect(gen.dependencies).toEqual(['precss', 'autoprefixer', 'css-loader', 'postcss-loader', 'style-loader']);
        expect(regExpForStyles).toEqual('/.css$/');
        expect(ExtractUseProps.length).toEqual(3);

        expect(gen.configuration.config.topScope.length).not.toEqual(0);
    });

    it('generates production PostCSS configuration', () => {
        const gen = getMockGenerator();
        gen.isProd = true;
        const { ExtractUseProps, regExpForStyles } = style(gen, StylingType.PostCSS);
        expect(gen.dependencies).toEqual(['precss', 'autoprefixer', 'css-loader', 'postcss-loader']);
        expect(regExpForStyles).toEqual('/.css$/');
        expect(ExtractUseProps.length).toEqual(2);
    });
});
