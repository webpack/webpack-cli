import * as path from "path";

export default [
  {
	resolve: {
		root: path.resolve("/src"),
	},
  },
  {
	resolve: {
		root: [path.resolve("/src")],
	},
  },
  {
	resolve: {
		root: [path.resolve("/src"), "node_modules"],
	},
  },
  {
	resolve: {
		modules: ["node_modules"],
		root: path.resolve("/src"),
	},
  },
];
