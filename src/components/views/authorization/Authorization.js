import React from 'react';
import SessionValidator from "../../common/model/SessionValidator";
import Register from "./components/register/Register";
import Login from "./components/login/Login";

import {Grid, Row, Col, PageHeader, PageHeaderHeading, Icon, Alert} from "react-lightning-design-system";
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
            <Grid className="slds-brand-band slds-brand-band_medium">
                <Row>
                    <Col>
                        {jwtExpired && <Alert icon="ban" level="error" onClose={_ => {
                            this.setState({jwtExpired: false})
                        }}>Your session has expired, please login again.</Alert>}
                        <div className="slds-align_absolute-center slds-m-top_large">
                            <div className="slds-box slds-theme_shade slds-theme_alert-texture">
                                <PageHeader>
                                    <PageHeaderHeading title="xMessenger"
                                                       info="Free messenger written on ReactJS, Java Spring and SLDS"
                                                       figure={<Icon category="standard" size="medium"
                                                                     icon="connected_apps"/>}/>
                                </PageHeader>
                                <div className="slds-m-top_medium">
                                    {register
                                        ? <Register onSwitchForm={this.switchForm}/>
                                        : <Login onSwitchForm={this.switchForm}/>}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default SessionValidator({isLoginEntry: true})(Authorization);