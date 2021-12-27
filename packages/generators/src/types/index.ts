import Generator from "yeoman-generator";

export class CustomGenerator extends Generator {
  public force: boolean | undefined;
  public dependencies: string[];
  public answers: Record<string, unknown> | undefined;
  public configurationPath: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  constructor(args: any, opts: any) {
    super(args, opts);

    this.dependencies = [];
  }
}
