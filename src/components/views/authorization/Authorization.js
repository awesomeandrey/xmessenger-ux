import React from 'react';
import SessionValidator from "../../common/model/SessionValidator";
import Register from "./components/register/Register";
import Login from "./components/login/Login";

import {Grid, Row, Col, PageHeader, PageHeaderHeading, Icon, Alert} from "react-lightning-design-system";

class Authorization extends React.Component {
    constructor(props) {
        super(props);
        this.switchForm = this.switchForm.bind(this);
        this.state = {
            isRegistered: true,
            jwtExpired: false
        };
    }

    componentDidMount() {
        if (window.location.href.includes("expired")) {
            this.setState({jwtExpired: true});
        }
    }

    switchForm() {
        this.setState({
            isRegistered: !this.state.isRegistered
        });
    }

    render() {
        const {isRegistered, jwtExpired} = this.state;
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
                                    {isRegistered
                                        ? <Login onSwitchForm={this.switchForm}/>
                                        : <Register onSwitchForm={this.switchForm}/>}
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