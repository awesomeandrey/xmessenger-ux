import sf from "node-salesforce";

import {getConnection} from "../../../../../api/salesforce/server-util";

export const getAppNews = _ => {
    return getConnection().then(conn => {
        return new Promise((resolve, reject) => {
            conn.sobject("Application_News__c")
                .find({CreatedDate: sf.Date.LAST_N_DAYS(3)}, ["Id", "Title__c", "Details__c", "Level__c", "CreatedDate"])
                .limit(3)
                .sort({CreatedDate: -1})
                .execute((err, records) => {
                    if (!!err) {
                        reject(err);
                    } else {
                        resolve(records);
                    }
                });
        }).then(data => {
            return data.map(sfPayloadItem => ({
                sfId: sfPayloadItem["Id"],
                title: sfPayloadItem["Title__c"],
                details: sfPayloadItem["Details__c"],
                level: sfPayloadItem["Level__c"],
                createdDate: sfPayloadItem["CreatedDate"]
            }));
        });
    });
};