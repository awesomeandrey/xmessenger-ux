import React from 'react';
import Events from "../../../../../../../../model/events/application-events";
import ProfileSettings from "./components/ProfileSettings";
import PasswordSettings from "./components/PasswordSettings";
import DeleteAccount from "./components/DeleteAccount";
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
            callback: _ => {
                this.setState({
                    opened: true,
                    activeTabKey: DEFAULT_TAB_KEY
                });
            }
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
            <div className="settings-modal-container">
                <Modal opened={opened} onHide={_ => this.setState({opened: false})}>
                    <ModalHeader title="Settings" closeButton={!loading}/>
                    <ModalContent>
                        <Tabs type="scoped" activeKey={activeTabKey} onSelect={this.handleSelectTab}>
                            <Tab eventKey="1" title="Profile Info">
                                <ProfileSettings user={user}/>
                            </Tab>
                            <Tab eventKey="2" title="Change Password">
                                <PasswordSettings user={user}/>
                            </Tab>
                            <Tab eventKey="3" title="Choose Theme">
                                <ThemePicker/>
                            </Tab>
                            <Tab eventKey="4" title="Delete Account">
                                <DeleteAccount user={user}/>
                            </Tab>
                        </Tabs>
                    </ModalContent>
                </Modal>
                {this.props.children}
            </div>
        );
    }
}

export default SettingsModal;