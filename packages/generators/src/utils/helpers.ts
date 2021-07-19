import { List } from "./scaffold-utils";

const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

/**
 * Convert str to kebab-case
 * @param str input string
 * @returns output string
 */
export function toKebabCase(str: string): string {
    return str.match(regex).join("-").toLowerCase();
}

/**
 * Convert str to UpperCamelCase
 * @param str import string
 * @returns {string} output string
 */
export function toUpperCamelCase(str: string): string {
    return str
        .match(regex)
        .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
        .join("");
}

export async function getInstaller(): Promise<string> {
    const installers = this.utils.getAvailableInstallers();

    if (installers.length === 1) {
        return installers[0];
    }

    // Prompt for the package manager of choice
    const defaultPackager = this.utils.getPackageManager();
    const { packager } = await List(
        this,
        "packager",
        "Pick a package manager:",
        installers,
        defaultPackager,
        this.force,
    );
    return packager;
}

export async function getTemplate(): Promise<string> {
    if (this.supportedTemplates.includes(this.template)) {
        return this.template;
    }

    this.utils.logger.warn(
        `⚠ ${this.template} is not a valid template, please select one from below`,
    );

    const { selectedTemplate } = await List(
        this,
        "selectedTemplate",
        "Select a valid template from below:",
        this.supportedTemplates,
        "default",
        false,
    );

    return selectedTemplate;
}
