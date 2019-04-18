import { information } from "../index";

describe("info", () => {
	it("should return the information of the enviroment", async () => {
		const returnedInformation = information();
		const expectedInformation = {
			Binaries: ["Node", "Yarn", "npm"],
			Browsers: ["Chrome", "Firefox", "Safari"],
			System: ["OS", "CPU"],
			npmGlobalPackages: ["webpack", "webpack-cli"],
			npmPackages: "*webpack*"
		};

		expect(returnedInformation).toEqual(expectedInformation);
	});
});
