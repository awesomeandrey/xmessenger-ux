import React from "react";
import NotificationEvents from "../../../../../../components/common/components/notifications/notification-events";

import {performLocalRequest} from "../../../../../api/rest/client-util";
import {LocalEntities, LocalStorage} from "../../../../utility/StorageService";
import {CustomEvents} from "../../../../utility/EventsService";

const acknowledgeNews = newsId => {
    const appNewsAcknowledged = LocalStorage.getItem(LocalEntities.APP_NEWS_ACKNOWLEDGED) || [];
    if (!appNewsAcknowledged.includes(newsId)) {
        appNewsAcknowledged.unshift(newsId); // add item to array beginning;
        LocalStorage.setItem({key: LocalEntities.APP_NEWS_ACKNOWLEDGED, value: appNewsAcknowledged.slice(0, 5)});
    }
};

export const getAppNews = () => {
    return performLocalRequest({url: "/news", method: "GET"})
        .then(newsData => {
            const appNewsAcknowledged = LocalStorage.getItem(LocalEntities.APP_NEWS_ACKNOWLEDGED) || [];
            return newsData.filter(_ => !appNewsAcknowledged.includes(_["sfId"]));
        })
        .then(newsToNotifyAbout => {
            newsToNotifyAbout.forEach(newsItem => {
                CustomEvents.fire({
                    eventName: NotificationEvents.SHOW,
                    detail: {
                        dismissible: false,
                        message: (<span><b>App News: </b>{newsItem["title"]}</span>),
                        onClick: _ => acknowledgeNews(newsItem["sfId"])
                    }
                });
            });
        });
};