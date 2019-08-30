import fs from "fs";
import jwt from "salesforce-jwt-bearer-token-flow";

import {SF_CLIENT_ID, SF_USERNAME} from "../../constants";

const _privateKey = fs.readFileSync("public/assets/private.pem").toString("utf8");

export const authorizeConnectedApp = () => {
    return new Promise((resolve, reject) => {
        const processToken = _ => resolve(_["access_token"]), tokenInfo = jwt.getToken({
                iss: SF_CLIENT_ID,
                sub: SF_USERNAME,
                aud: process.env.NODE_ENV === "production" ? "https://login.salesforce.com" : "https://test.salesforce.com",
                privateKey: _privateKey,
            }, (err, tokenInfo) => {
                if (!!err || !tokenInfo) {
                    reject(err);
                } else {
                    processToken(tokenInfo);
                }
            }
        );
        if (!!tokenInfo) processToken(tokenInfo);
    });
};