export type {
  ActionConfig,
  ActionType,
  AddActionConfig,
  AddManyActionConfig,
  AppendActionConfig,
  CustomActionFunction,
  ModifyActionConfig,
  PlopCfg,
  PlopGenerator,
  NodePlopAPI,
  PlopGeneratorConfig,
  Actions,
} from "node-plop";

export type InitOptions = { template: string; force?: boolean };
export type LoaderOptions = { template: string };
export type PluginOptions = { template: string };
export type InitGeneratorOptions = { generationPath: string } & InitOptions;
export type LoaderGeneratorOptions = { generationPath: string } & LoaderOptions;
export type PluginGeneratorOptions = { generationPath: string } & PluginOptions;
