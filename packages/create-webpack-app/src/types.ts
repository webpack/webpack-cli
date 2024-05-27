export type {
  ActionConfig,
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
import { ActionType as ActionTypeBase, CustomActionConfig } from "node-plop";
// extended ACtionType to include custom action config as previously it was not recognizing
export type ActionType = ActionTypeBase | CustomActionConfig<string>;
export type InitOptions = { template: string; force?: boolean };
export type LoaderOptions = { template: string };
export type PluginOptions = { template: string };
export type InitGeneratorOptions = { generationPath: string } & InitOptions;
export type LoaderGeneratorOptions = { generationPath: string } & LoaderOptions;
export type PluginGeneratorOptions = { generationPath: string } & PluginOptions;
