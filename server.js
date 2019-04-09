const path = require("path");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 80;

app.use("/public", express.static("public"));
app.use("/assets", express.static("public/assets"));

app.get("*", function (req, res) {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Launched NodeJS application.");
});