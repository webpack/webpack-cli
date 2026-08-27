const path = require("node:path");
const { pathToFileURL } = require("node:url");

const LIB = path.resolve(__dirname, "../../../packages/create-webpack-app/lib");

const BASE_ANSWERS = {
  projectPath: "/tmp/create-webpack-app-generators",
  langType: "ES6",
  devServer: true,
  workboxWebpackPlugin: false,
  useReactState: true,
  useVueStore: true,
  packageManager: "npm",
};

// Each template scaffolds its stylesheet in a different place
const STYLESHEETS = {
  default: (extension) => `styles.${extension}`,
  react: (extension) => `global.${extension}`,
  vue: (extension) => `global.${extension}`,
  svelte: (extension) => `global.${extension}`,
};

const TEMPLATES = Object.keys(STYLESHEETS);

// Every choice of the CSS tool question, and what it has to pull in
const CSS_TOOLS = [
  { answer: "none", extension: "css", packages: [] },
  { answer: "PostCSS", extension: "css", packages: ["postcss-loader", "postcss", "autoprefixer"] },
  { answer: "SASS", extension: "scss", packages: ["sass-loader", "sass"] },
  {
    answer: "SASS with PostCSS",
    extension: "scss",
    packages: ["sass-loader", "sass", "postcss-loader"],
  },
  { answer: "LESS", extension: "less", packages: ["less-loader", "less"] },
  {
    answer: "LESS with PostCSS",
    extension: "less",
    packages: ["less-loader", "less", "postcss-loader"],
  },
  { answer: "Stylus", extension: "styl", packages: ["stylus-loader", "stylus"] },
  {
    answer: "Stylus with PostCSS",
    extension: "styl",
    packages: ["stylus-loader", "stylus", "postcss-loader"],
  },
];

/**
 * Registers a generator against the few plop methods it calls, so its answer
 * handling can be exercised without a plop instance.
 * @param {string} template template name
 * @returns {Promise<EXPECTED_ANY>} the generator config
 */
const generatorFor = async (template) => {
  const module = await import(pathToFileURL(path.join(LIB, "generators/init", `${template}.js`)));

  let config;

  await module.default({
    load: async () => {},
    setDefaultInclude: () => {},
    setPlopfilePath: () => {},
    getPlopfilePath: () => path.join(LIB, "plopfile.js"),
    setGenerator: (name, generatorConfig) => {
      config = generatorConfig;
    },
  });

  return config;
};

// The action list is built without running any action, so no project is written
// and nothing is installed.
const actionsFor = async (template, answers) => {
  const generator = await generatorFor(template);

  return generator.actions({ ...BASE_ANSWERS, ...answers });
};

const filesFrom = (actions) =>
  actions
    .filter((action) => action.type === "generate-files")
    .map((action) => path.basename(action.path));

const packagesFrom = (actions) =>
  actions.find((action) => action.type === "install-dependencies").packages;

describe("create-webpack-app generators", () => {
  for (const template of TEMPLATES) {
    for (const { answer, extension, packages } of CSS_TOOLS) {
      it(`scaffolds the ${template} template with "${answer}"`, async () => {
        const actions = await actionsFor(template, { cssTool: answer });
        const files = filesFrom(actions);
        const installed = packagesFrom(actions);

        // the starter stylesheet is written in the language that was picked
        expect(files).toContain(STYLESHEETS[template](extension));

        for (const name of packages) {
          expect(installed).toContain(name);
        }

        // PostCSS is the only tool that needs a config file
        if (answer.includes("PostCSS")) {
          expect(files).toContain("postcss.config.js");
        } else {
          expect(files).not.toContain("postcss.config.js");
        }

        // whatever is picked, webpack's own CSS and HTML support stays untouched
        expect(installed).not.toContain("css-loader");
        expect(installed).not.toContain("style-loader");
        expect(installed).not.toContain("mini-css-extract-plugin");
        expect(installed).not.toContain("html-webpack-plugin");
        expect(files).toContain("index.html");
      });
    }
  }

  it("scaffolds TypeScript on webpack's own support, with a tsconfig to check against", async () => {
    const actions = await actionsFor("default", { langType: "Typescript", cssTool: "none" });
    const files = filesFrom(actions);
    const installed = packagesFrom(actions);

    expect(files).toContain("index.ts");
    expect(files).toContain("tsconfig.json");
    // `typescript` is for the editor and `check:types`, not for the build
    expect(installed).toContain("typescript");
    expect(installed).not.toContain("ts-loader");
  });

  // Only the default template can lean on webpack: type stripping handles neither
  // `.tsx` nor the single-file components the framework loaders produce.
  for (const template of ["react", "vue", "svelte"]) {
    it(`keeps a TypeScript loader for the ${template} template`, async () => {
      const actions = await actionsFor(template, { langType: "Typescript", cssTool: "none" });

      expect(packagesFrom(actions)).toContain("ts-loader");
    });
  }
});
