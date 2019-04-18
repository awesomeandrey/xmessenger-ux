const path = require("path");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 80;

const cacheControl = {maxAge: "30d"};
app.use("/public", express.static("public", cacheControl));
app.use("/assets", express.static("node_modules/@salesforce-ux/design-system/assets", cacheControl));

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