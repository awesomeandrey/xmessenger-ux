import fs from "fs";
import jwt from "salesforce-jwt-bearer-token-flow";
import sf from "node-salesforce";

import {SF_CLIENT_ID, SF_USERNAME} from "../../constants";

const _privateKey = fs.readFileSync("public/assets/private.pem").toString("utf8");
const _serverUrl = process.env.NODE_ENV === "production" ? "https://login.salesforce.com" : "https://test.salesforce.com";

const _authorizeConnectedApp = () => {
    return new Promise((resolve, reject) => {
        const tokenInfo = jwt.getToken({
                iss: SF_CLIENT_ID,
                sub: SF_USERNAME,
                aud: _serverUrl,
                privateKey: _privateKey,
            }, (err, tokenInfo) => {
                if (!!err) {
                    reject(err);
                } else {
                    resolve(tokenInfo);
                }
            }
        );
        if (!!tokenInfo) resolve(tokenInfo);
    });
};

export const getConnection = () => {
    return _authorizeConnectedApp().then(tokenInfo => new sf.Connection({
        instanceUrl: tokenInfo["instance_url"],
        accessToken: tokenInfo["access_token"]
    }));
};