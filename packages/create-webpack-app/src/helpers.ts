import Generator from "./generator";
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

export async function getInstaller(self: Generator): Promise<string> {
  const installers = self.cli.getAvailablePackageManagers();

  if (installers.length === 1) {
    return installers[0];
  }

  // Prompt for the package manager of choice
  const defaultPackager = self.cli.getDefaultPackageManager();
  const { packager } = await List(
    self,
    "packager",
    "Pick a package manager:",
    installers,
    defaultPackager,
    self.force,
  );
  return packager;
}

export async function getTemplate(self: Generator): Promise<string> {
  if (self.supportedTemplates.includes(self.template)) {
    return self.template;
  }

  self.cli.logger.warn(`⚠ ${self.template} is not a valid template, please select one from below`);

  const { selectedTemplate } = await List(
    self,
    "selectedTemplate",
    "Select a valid template from below:",
    self.supportedTemplates,
    "default",
    false,
  );

  return selectedTemplate;
}
