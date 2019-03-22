const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const webpack = require("webpack");
const config = process.env.NODE_ENV === "production"
    ? require("./webpack.prod")
    : require("./webpack.dev");
const app = express();
const compiler = webpack(config);

const PORT = process.env.PORT || 443;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use("/public", express.static("public"));
app.use("/assets", express.static("public/assets"));
app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

const https = require("https");
const fs = require("fs");

https.createServer({
    key: fs.readFileSync("public/ssl-certificate/server.key"),
    cert: fs.readFileSync("public/ssl-certificate/server.cert")
}, app).listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Listening at https://xmessenger.local:${PORT}`);
});