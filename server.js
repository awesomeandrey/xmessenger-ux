const path = require("path");

import express from "express";
import subscribeToTopics from "./src/model/api/streaming/TopicsSubscriber-v2";

const app = express(), PORT = process.env.PORT || 80,
    cacheControl = process.env.NODE_ENV === "production" ? {maxAge: "1d"} : {};
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

// TODO - subscribe to channels from API server;
subscribeToTopics();