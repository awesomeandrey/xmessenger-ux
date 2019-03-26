const path = require("path");
const webpack = require("webpack");

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
    },
    plugins: [
        new webpack.DefinePlugin({
            API_SERVER_URL: JSON.stringify(process.env["XM_API_SERVER_URL"])
        })
    ]
};