import path from "path";
import express from "express";
import bodyParser from "body-parser";
import subscribe from "./src/model/api/streaming/services/TopicsManager";

import {getPushNotificationFunc} from "./src/model/api/streaming/core/web-push-manager";
import {getAppNews} from "./src/model/services/salesforce/AppNewsService";

const app = express(), isProduction = process.env.NODE_ENV === "production",
    cacheControl = isProduction ? {maxAge: "1h"} : {}, PORT = process.env.PORT || 80;
app.use("/public", express.static("public", cacheControl));
app.use("/assets", express.static("node_modules/@salesforce-ux/design-system/assets", cacheControl));
app.use(bodyParser.json());

app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.resolve("service-worker.js"));
});

app.get("/news", (req, res) => {
    getAppNews().then(data => {
        const parsedData = data.map(sfPayloadItem => ({
            sfId: sfPayloadItem["Id"],
            title: sfPayloadItem["Title__c"],
            details: sfPayloadItem["Details__c"],
            level: sfPayloadItem["Level__c"]
        }));
        res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour;
        res.send(parsedData);
    }).catch(error => {
        console.log(">>> Error when requesting app news", JSON.stringify(error));
        res.sendStatus(500);
    });
});

app.get("*", function (req, res) {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(path.resolve("public/index.html"));
});

app.post("/subscribe", (req, res) => {
    res.status(201).json({});
    const subscriptionDetails = req.body;
    if (!!subscriptionDetails) {
        let pushNotificationFunc = getPushNotificationFunc(subscriptionDetails);
        subscribe(pushNotificationFunc);
    } else {
        console.error("No subscription details provided!");
    }
});

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Launched NodeJS application.");
});