import { informationType } from "../index";

describe("infoSystem", () => {
	it("should return the information of the system", async () => {
		const returnedInformation = informationType("system");
		const expectedInformation = { System: ["OS", "CPU", "Memory"] };

		expect(returnedInformation).toEqual(expectedInformation);
	});
});

describe("infoBinaries", () => {
	it("should return the information of the binaries", async () => {
		const returnedInformation = informationType("binaries");
		const expectedInformation = { Binaries: ["Node", "Yarn", "npm"] };

		expect(returnedInformation).toEqual(expectedInformation);
	});
});

describe("infoBrowsers", () => {
	it("should return the information of the browsers installed", async () => {
		const returnedInformation = informationType("browsers");
		const expectedInformation = { Browsers: ["Chrome", "Firefox", "Safari"] };

		expect(returnedInformation).toEqual(expectedInformation);
	});
});

describe("infoNpmGlobal", () => {
	it("should return the information of the NPM global packages", async () => {
		const returnedInformation = informationType("npmg");
		const expectedInformation = { npmGlobalPackages: ["webpack", "webpack-cli"] };

		expect(returnedInformation).toEqual(expectedInformation);
	});
});

describe("infoNpm", () => {
	it("should return the information of the NPM packages (webpack)", async () => {
		const returnedInformation = informationType("npm");
		const expectedInformation = { npmPackages: "*webpack*" };

		expect(returnedInformation).toEqual(expectedInformation);
	});
});
