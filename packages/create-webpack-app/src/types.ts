export type {
  ActionConfig,
  AddActionConfig,
  CustomActionConfig,
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
// eslint-disable-next-line
export type Answers = Record<string, any>;
export interface PlopActionHooksFailures {
  type: string;
  path: string;
  error: string;
  message: string;
}

export interface PlopActionHooksChanges {
  type: string;
  path: string;
}
import { ActionType as ActionTypeBase, CustomActionConfig } from "node-plop";
// extended ACtionType to include custom action config as previously it was not recognizing
export type ActionType = ActionTypeBase | CustomActionConfig<string>;
export type InitOptions = { template: string; force?: boolean };
export type LoaderOptions = { template: string };
export type PluginOptions = { template: string };
export type InitGeneratorOptions = { generationPath: string } & InitOptions;
export type LoaderGeneratorOptions = { generationPath: string } & LoaderOptions;
export type PluginGeneratorOptions = { generationPath: string } & PluginOptions;
