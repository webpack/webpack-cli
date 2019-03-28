import * as envinfo from "envinfo";

import { information } from "../index";

describe("info", () => {
	it("should return the information structure", async () => {
		const returnedInformation = information();
		const expectedInformation = {
			Binaries: ["Node", "Yarn", "npm"],
			Browsers: ["Chrome", "Firefox", "Safari"],
			System: ["OS", "CPU"],
			npmGlobalPackages: ["webpack", "webpack-cli"],
			npmPackages: "*webpack*",
		};

		expect(returnedInformation).toEqual(expectedInformation);
	});
	it("should return the proper information of the environment", async () => {
		const environment = JSON.parse(await envinfo.run(information(), { json: true } ));
		const jsonSchema = ["Binaries", "Browsers", "System", "npmPackages", "npmGlobalPackages"];

		expect(jsonSchema).toEqual(expect.arrayContaining(Object.keys(environment)));
	}, 15000);
});
