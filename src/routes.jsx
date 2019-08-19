import React, {useState, useEffect} from "react";
import About from "./components/views/about/About";
import Authorization from "./components/views/authorization/Authorization";
import ProxyPage from "./components/views/authorization/components/oauth.gmail/ProxyPage";
import Home from "./components/views/home/Home";
import Error from "./components/views/error/Error";
import ModalsContainer from "./components/common/components/modals/ModalsContainer";
import ToastContainer from "./components/common/components/toasts/ToastContainer";
import BrandBand from "@salesforce/design-system-react/module/components/brand-band";
import IconSettings from "@salesforce/design-system-react/module/components/icon-settings";
import ApplicationEvents from "./model/application-events";
import Spinner from "@salesforce/design-system-react/module/components/spinner";
import PageTitleManager from "./components/common/components/page-title/PageTitleManager";

import {Route, IndexRoute} from "react-router";
import {CustomEvents} from "./model/services/utility/EventsService";
import {subscribeFromClient} from "./model/api/streaming/services/TopicsManager";
import {serviceWorkerAllowed, registerServiceWorker} from "./model/api/streaming/services/ServiceWorkerRegistrator";

const AppContainer = props => {
    const [loading, setLoading] = useState(false);

    useEffect(_ => {
        // Subscribe to server events via Websocket API;
        subscribeFromClient();

        // Register service worker for rich notifications;
        if (serviceWorkerAllowed) {
            CustomEvents.register({eventName: "load", callback: registerServiceWorker});
        }

        CustomEvents.register({
            eventName: ApplicationEvents.APP_DEFAULT.LOADING, callback: event => setLoading(event.detail.loading)
        });
    }, []);

    return (
        <PageTitleManager>
            <IconSettings iconPath="/assets/icons">
                <ModalsContainer>
                    <ToastContainer>
                        <BrandBand theme="lightning-blue">
                            {loading && <Spinner variant="brand"
                                                 containerClassName="slds-is-fixed slds-spinner_container_overridden slds-spinner_with-text"/>}
                            {props.children}
                        </BrandBand>
                    </ToastContainer>
                </ModalsContainer>
            </IconSettings>
        </PageTitleManager>
    );
};

export default (
    <Route path="/" component={AppContainer}>
        <IndexRoute component={Authorization}/>
        <Route path="login" component={Authorization}/>
        <Route path="home" component={Home}/>
        <Route path="oauth/gmail/callback" component={ProxyPage}/>
        <Route path="about" component={About}/>
        <Route path="*" component={Error}/>
    </Route>
);