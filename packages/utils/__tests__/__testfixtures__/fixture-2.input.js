const webpack = require("webpack");

module.exports = {
	entry: {
            objects: "are",
            super: [
                "yeah",
                {
                    test: new RegExp(/\.(js|vue)$/),
                    loader: "'eslint-loader'",
                    enforce: "'pre'",
                    include: ["customObj", "'Stringy'"],
                    options: {
                        formatter: "'oki'",
                        updateMe: "sure"
                    }
                }
            ],
            nice: "':)'",
            foo: "Promise.resolve()",
            man: "() => duper",
            mode: "yaaa"

    }
}
