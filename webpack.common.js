const path = require("path");

module.exports = {
    entry: {
        "build.js": "./src/index.jsx"
    },
    output: {
        filename: "[name]",
        path: path.resolve(__dirname, "public/build/"),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    }
};