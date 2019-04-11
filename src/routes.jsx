import React from "react";
import About from "./components/views/about/About";
import Authorization from "./components/views/authorization/Authorization";
import ProxyPage from "./components/views/authorization/components/oauth.gmail/ProxyPage";
import Home from "./components/views/home/Home";
import Error from "./components/views/error/Error";
import ModalsContainer from "./components/common/components/modals/components/ModalsContainer";
import ToastContainer from "./components/common/components/toasts/components/ToastContainer";
import BrandBand from "@salesforce/design-system-react/module/components/brand-band";
import IconSettings from "@salesforce/design-system-react/module/components/icon-settings";

import {Route, IndexRoute} from "react-router";

const App = props => {
    return (
        <IconSettings iconPath="/assets/icons">
            <BrandBand theme="lightning-blue">
                <ModalsContainer>
                    <ToastContainer>
                        {props.children}
                    </ToastContainer>
                </ModalsContainer>
            </BrandBand>
        </IconSettings>
    );
};

export default (
    <Route path="/" component={App}>
        <IndexRoute component={About}/>
        <Route path="login" component={Authorization}/>
        <Route path="home" component={Home}/>
        <Route path="oauth/gmail/callback" component={ProxyPage}/>
        <Route path="*" component={Error}/>
    </Route>
);