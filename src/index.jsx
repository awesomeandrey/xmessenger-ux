import React from "react";
import ReactDom from "react-dom";
import routes from "./routes.jsx";

import {Router, browserHistory} from "react-router";

ReactDom.render(
    <Router history={browserHistory} routes={routes}/>,
    document.querySelector("#app")
);