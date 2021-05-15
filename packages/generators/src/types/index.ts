import Generator from "yeoman-generator";

export class CustomGenerator extends Generator {
    public force: boolean;
    public dependencies: string[];
    public answers: Record<string, unknown>;
    public configurationPath: string;
}
