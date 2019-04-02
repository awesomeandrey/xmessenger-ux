import React from "react";
import About from "./components/views/about/About";
import Authorization from "./components/views/authorization/Authorization";
import ProxyPage from "./components/views/authorization/components/oauth.gmail/ProxyPage";
import Home from "./components/views/home/Home";
import Error from "./components/views/error/Error";
import ModalsContainer from "./components/common/components/modals/components/ModalsContainer";
import ToastContainer from "./components/common/components/toasts/components/ToastContainer";

import {Route, IndexRoute} from "react-router";

// If needed, some global custom wrappers may be injected here;
const App = props => {
    return (
        <ModalsContainer>
            <ToastContainer>
                {props.children}
            </ToastContainer>
        </ModalsContainer>
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