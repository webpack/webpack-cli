import { type ActionType as ActionTypeBase, type CustomActionConfig } from "node-plop";

export type Answers = { projectPath?: string } & Record<string, unknown>;
export type LoaderAnswers = { name: string; projectPath: string } & Record<string, unknown>;
export type PluginAnswers = { name: string; projectPath: string } & Record<string, unknown>;

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
// extended ACtionType to include custom action config as previously it was not recognizing
export type ActionType = ActionTypeBase | CustomActionConfig<string>;

export interface InitOptions {
  template: string;
  force?: boolean;
}
export interface LoaderOptions {
  template: string;
}
export interface PluginOptions {
  template: string;
}

export interface FileRecord {
  filePath: string;
  fileType: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogHandler = (value: any) => void;

export interface Logger {
  error: LogHandler;
  warn: LogHandler;
  info: LogHandler;
  success: LogHandler;
  log: LogHandler;
  raw: LogHandler;
}
