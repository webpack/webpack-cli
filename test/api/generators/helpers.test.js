const path = require("path");

const utilsDirectory = {
    cli: "../../../packages/webpack-cli/lib/utils",
    generators: "../../../packages/generators/src/utils",
};

jest.setMock(path.join(utilsDirectory.cli, "get-available-installers"), jest.fn());
jest.mock(path.join(utilsDirectory.generators, "scaffold-utils"), () => ({
    List: jest.fn(),
}));

const getAvailableInstallers = require(path.join(utilsDirectory.cli, "get-available-installers"));
const getPackageManager = require(path.join(utilsDirectory.cli, "get-package-manager"));
const logger = require(path.join(utilsDirectory.cli, "logger"));

const { getInstaller, getTemplate } = require(path.join(utilsDirectory.generators, "helpers"));
const { List } = require(path.join(utilsDirectory.generators, "scaffold-utils"));

const context = {
    prompt: () => {},
    supportedTemplates: ["default"],
    utils: {
        getAvailableInstallers,
        getPackageManager,
        logger,
    },
};

describe("helpers", () => {
    it("getInstaller() returns the available installer", async () => {
        // Multiple installers are not available
        getAvailableInstallers.mockReturnValue(["npm"]);

        // Invoke the helper function
        const installer = await getInstaller.call(context);
        expect(installer).toBe("npm");
    });

    it("getInstaller() invokes a List prompt if multiple installers are available", async () => {
        // Multiple installers are available
        getAvailableInstallers.mockReturnValue(["npm", "yarn", "pnpm"]);

        // User chose "pnpm"
        List.mockReturnValue({ packager: "pnpm" });

        // Invoke the helper function
        const installer = await getInstaller.call(context);
        expect(installer).toBe("pnpm");
    });

    it("getTemplate() returns with the valid template", async () => {
        context.template = "default";

        // Invoke the helper function
        const template = await getTemplate.call(context);
        expect(template).toBe("default");
    });

    it("getTemplate() invokes a List prompt on supplying an invalid template", async () => {
        context.template = "unknown";

        // User chose "default"
        List.mockReturnValue({ selectedTemplate: "default" });

        const loggerMock = jest.spyOn(logger, "warn").mockImplementation(() => {});

        // Invoke the helper function`
        const template = await getTemplate.call(context);
        expect(template).toBe("default");
        expect(loggerMock).toHaveBeenCalled();
    });
});
