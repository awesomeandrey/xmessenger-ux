const path = require("path");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 443;

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