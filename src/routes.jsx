import React from "react";
import {Route, IndexRoute} from "react-router";

import About from "./components/views/about/About";
import Authorization from "./components/views/authorization/Authorization";
import ProxyPage from "./components/views/authorization/oauth.gmail/ProxyPage";
import Home from "./components/views/home/Home";
import Error from "./components/views/error/Error";

const App = props => {
    return (
        <div>{props.children}</div>
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