import sf from "node-salesforce";

import {getConnection} from "../../api/salesforce/client-util";

export const getAppNews = _ => {
    return getConnection().then(conn => {
        return new Promise((resolve, reject) => {
            conn.sobject("Application_News__c")
                .find({CreatedDate: sf.Date.LAST_N_DAYS(3)}, ["Id", "Title__c", "Details__c", "Level__c"])
                .limit(3)
                .sort({CreatedDate: -1})
                .execute((err, records) => {
                    if (!!err) {
                        reject(err);
                    } else {
                        resolve(records);
                    }
                });
        });
    });
};