import Generator from "yeoman-generator";

export type InitOptions = { template: string; force?: boolean };
export type LoaderOptions = { template: string };
export type PluginOptions = { template: string };

export class CustomGenerator extends Generator {
  public force: boolean;
  public dependencies: string[];
  public answers: Record<string, unknown>;
  public configurationPath: string;
}
