import React, {useEffect} from "react";

import {CustomEvents} from "../../../../model/services/utility/EventsService";

import ApplicationEvents from "../../../../model/application-events";

const DEFAULT_TITLE = "xMessenger", setPageTitle = title => {
    document.title = title || DEFAULT_TITLE;
};

const PageTitleManager = props => {

    useEffect(() => {
        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.SELECT, callback: event => {
                const {selectedChat} = event.detail;
                if (!!selectedChat) {
                    setPageTitle([selectedChat["fellow"]["name"], DEFAULT_TITLE].join(" - "));
                } else {
                    setPageTitle();
                }
            }
        });
        CustomEvents.register({
            eventName: ApplicationEvents.SETTINGS.OPEN, callback: event => {
                const {isOpen} = event.detail;
                if (isOpen) {
                    setPageTitle(["Settings", DEFAULT_TITLE].join(" - "));
                } else {
                    setPageTitle();
                }
            }
        });
    }, []);

    return props.children;
};

export default PageTitleManager;