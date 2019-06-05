import entryQuestions from "./entry";
import langQuestionHandler, { LangType, getBabelLoader, getTypescriptLoader } from "./languageSupport";
import plugins, { replaceAt, generatePluginName } from "./plugins";
import styleQuestionHandler, { StylingType, LoaderName, StyleRegex, Loader } from "./styleSupport";
import tooltip from "./tooltip";
import validate from "./validate";
import { getDefaultOptimization } from "./webpackConfig";

export {
	entryQuestions,
	langQuestionHandler,
	LangType,
	getBabelLoader,
	getTypescriptLoader,
	plugins,
	replaceAt,
	generatePluginName,
	styleQuestionHandler,
	StylingType,
	LoaderName,
	StyleRegex,
	Loader,
	tooltip,
	validate,
	getDefaultOptimization
};
