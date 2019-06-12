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

import {registerServiceWorker} from "./model/api/streaming/services/ServiceWorkerRegistrator";
import {Route, IndexRoute} from "react-router";
import {CustomEvents} from "./model/services/utility/EventsService";
import {Utility} from "./model/services/utility/UtilityService";

const AppContainer = props => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!Utility.isMobileDevice()) {
            CustomEvents.register({eventName: "load", callback: registerServiceWorker});
        }
        CustomEvents.register({
            eventName: ApplicationEvents.APP_DEFAULT.LOADING, callback: event => {
                const {loading: loadingParam} = event.detail;
                setLoading(loadingParam);
            }
        });
    }, []);

    return (
        <IconSettings iconPath="/assets/icons">
            <ModalsContainer>
                <ToastContainer>
                    <BrandBand theme="lightning-blue">
                        {loading && <Spinner variant="brand" containerClassName="slds-is-fixed slds-spinner_container_overridden slds-spinner_with-text"/>}
                        {props.children}
                    </BrandBand>
                </ToastContainer>
            </ModalsContainer>
        </IconSettings>
    );
};

export default (
    <Route path="/" component={AppContainer}>
        <IndexRoute component={About}/>
        <Route path="login" component={Authorization}/>
        <Route path="home" component={Home}/>
        <Route path="oauth/gmail/callback" component={ProxyPage}/>
        <Route path="*" component={Error}/>
    </Route>
);