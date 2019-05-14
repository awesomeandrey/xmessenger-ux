import path from "path";
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

import {subscribeFromServer} from "./src/model/api/streaming/services/TopicsManager";
import {pushNotification} from "./src/model/api/streaming/core/web-push-manager";
import {API_SERVER_URL} from "./src/model/constants";

const app = express(), PORT = process.env.PORT || 80,
    cacheControl = process.env.NODE_ENV === "production" ? {maxAge: "1h"} : {};
app.use("/public", express.static("public", cacheControl));
app.use("/assets", express.static("node_modules/@salesforce-ux/design-system/assets", cacheControl));
app.use(bodyParser.json());

app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.resolve("service-worker.js"));
});

app.get("*", function (req, res) {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(path.resolve("public/index.html"));
});

app.post("/push-topics/subscribe", (req, res) => {
    res.status(201).json({});
    const subscriptionDetails = req.body;
    if (!!subscriptionDetails) {
        let pushNotificationFunc = pushNotification(subscriptionDetails);
        subscribeFromServer(pushNotificationFunc);
    } else {
        console.error("No subscription details provided!");
    }
});

app.post("/logout", (req, res) => {
    res.status(200).json({});
    const {token} = req.body;
    fetch(API_SERVER_URL + "/api/user/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }).then(res => {
    });
});

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Launched NodeJS application.");
});