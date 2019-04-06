import React from 'react';
import Events from "../../../../../../../../model/events/application-events";
import ProfileInfo from "./components/ProfileInfo";
import ProfileImage from "./components/ProfileImage";
import PasswordChange from "./components/PasswordChange";
import AccountDeactivation from "./components/AccountDeactivation";
import ThemePicker from "./components/ThemePicker";

import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";
import {Modal, ModalContent, ModalHeader, Tab, Tabs} from "react-lightning-design-system";

import "./styles/styles.css";

const DEFAULT_TAB_KEY = "1";

class SettingsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            loading: false,
            activeTabKey: DEFAULT_TAB_KEY
        }
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: Events.SETTINGS.OPEN,
            callback: _ => this.setState({opened: true, activeTabKey: DEFAULT_TAB_KEY})
        });
        CustomEvents.register({
            eventName: Events.SETTINGS.LOCK,
            callback: event => {
                const settings = event.detail;
                this.setState({loading: settings.locked});
            }
        });
    }

    handleSelectTab = (tabKey) => {
        const {loading} = this.state;
        if (!loading) {
            this.setState({activeTabKey: tabKey.toString()});
        }
    };

    render() {
        const {loading, opened, activeTabKey} = this.state, {user} = this.props;
        return (
            <Modal opened={opened} onHide={_ => this.setState({opened: false})} className="settings-modal-container">
                <ModalHeader title="Settings" closeButton={!loading}/>
                <ModalContent>
                    <Tabs type="scoped" activeKey={activeTabKey} onSelect={this.handleSelectTab}>
                        <Tab eventKey="1" title="Profile Info">
                            <div className="slds-grid slds-wrap slds-gutters">
                                <div className="slds-col slds-size_1-of-1 slds-medium-size_5-of-12 slds-large-size_6-of-12">
                                    <ProfileImage user={user}/>
                                </div>
                                <div className="slds-col slds-size_1-of-1 slds-medium-size_7-of-12 slds-large-size_6-of-12">
                                    <ProfileInfo user={user}/>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="2" title="Change Password">
                            {user["loggedExternally"]
                                ? (<div className="slds-align--absolute-center">
                                    <h1 className="slds-p-around_large">No password change</h1>
                                </div>) : <PasswordChange user={user}/>}
                        </Tab>
                        <Tab eventKey="3" title="Choose Theme">
                            <ThemePicker/>
                        </Tab>
                        <Tab eventKey="4" title="Delete Account">
                            <AccountDeactivation user={user}/>
                        </Tab>
                    </Tabs>
                </ModalContent>
            </Modal>
        );
    }
}

export default SettingsModal;