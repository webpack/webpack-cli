import entryQuestions from './entry';
import langQuestionHandler, { LangType, getBabelLoader, getTypescriptLoader } from './languageSupport';
import styleQuestionHandler, { StylingType, LoaderName, StyleRegex, Loader } from './styleSupport';
import tooltip from './tooltip';
import validate from './validate';

export {
    entryQuestions,
    langQuestionHandler,
    LangType,
    getBabelLoader,
    getTypescriptLoader,
    styleQuestionHandler,
    StylingType,
    LoaderName,
    StyleRegex,
    Loader,
    tooltip,
    validate,
};
