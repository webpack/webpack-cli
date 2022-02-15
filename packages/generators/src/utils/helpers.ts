import { CustomGenerator } from "../types";
import { List } from "./scaffold-utils";

const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

/**
 * Convert str to kebab-case
 * @param str input string
 * @returns output string
 */
export function toKebabCase(str: string): string {
  return (str.match(regex) as string[]).join("-").toLowerCase();
}

/**
 * Convert str to UpperCamelCase
 * @param str import string
 * @returns {string} output string
 */
export function toUpperCamelCase(str: string): string {
  return (str.match(regex) as string[])
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
    .join("");
}

export async function getInstaller(this: CustomGenerator): Promise<string> {
  const installers = this.cli.getAvailablePackageManagers();

  if (installers.length === 1) {
    return installers[0];
  }

  // Prompt for the package manager of choice
  const defaultPackager = this.cli.getDefaultPackageManager();
  const { packager } = await List(
    this,
    "packager",
    "Pick a package manager:",
    installers,
    defaultPackager as string,
    this.force,
  );
  return packager;
}

export async function getTemplate(this: CustomGenerator): Promise<string> {
  if (this.supportedTemplates.includes(this.template)) {
    return this.template;
  }

  this.cli.logger.warn(`⚠ ${this.template} is not a valid template, please select one from below`);

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
