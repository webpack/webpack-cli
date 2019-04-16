import { informationType } from "../index";

describe("info", () => {
	it("should return the information of the enviroment", async () => {
		const returnedInformation = informationType("binaries");
		const expectedInformation = {Binaries: ["Node", "Yarn", "npm"]};

		expect(returnedInformation).toEqual(expectedInformation);
	});
});
