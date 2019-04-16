import React from 'react';
import SessionValidator from "../../common/model/SessionValidator";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Alert from "@salesforce/design-system-react/module/components/alert";
import Icon from "@salesforce/design-system-react/module/components/icon";
import PageHeader from "@salesforce/design-system-react/module/components/page-header";

import {Utility} from "../../../model/services/utility/UtilityService";

const register = Utility.getParamFromUrl({paramName: "register"}) === "true";
const jwtExpired = !register && Utility.getParamFromUrl({paramName: "expired"}) === "1";

class Authorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {register, jwtExpired};
    }

    switchForm = _ => this.setState({
        register: !this.state.register
    });

    render() {
        const {register, jwtExpired} = this.state;
        return (
            <div className="slds-col height-fill slds-p-around_small">
                <Alert icon={<Icon category="utility" name="ban"/>} variant="error"
                       className={`${!jwtExpired && "slds-hide"}`} dismissible
                       labels={{heading: "Your session has expired, please login again.",}}
                       onRequestClose={_ => this.setState({jwtExpired: false})}/>
                <div className="slds-align_absolute-center">
                    <div className="slds-box slds-theme_shade slds-theme_alert-texture" style={{width: "25rem"}}>
                        <PageHeader iconCategory="standard" iconName="connected_apps"
                                    label="Cloud based app" variant="objectHome" truncate
                                    title={<h1 className="slds-page-header__title slds-p-right_x-small">xMessenger</h1>}
                        />
                        <div className="slds-m-top_medium">
                            {register
                                ? <Register onSwitchForm={this.switchForm}/>
                                : <Login onSwitchForm={this.switchForm}/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SessionValidator({isLoginEntry: true})(Authorization);