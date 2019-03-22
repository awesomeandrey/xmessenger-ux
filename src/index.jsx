import React from "react";
import ReactDom from "react-dom";

import {Router, browserHistory} from "react-router";
import routes from "./routes.jsx";

ReactDom.render(
    <Router history={browserHistory} routes={routes}/>,
    document.querySelector("#app")
);