import React from 'react';
import Events from "../../../../../model/HomePageEvents";
import ProfileSettings from "./tabs/ProfileSettings";
import PasswordSettings from "./tabs/PasswordSettings";
import DeleteAccount from "./tabs/DeleteAccount";
import ThemePicker from "./tabs/ThemePicker";

import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";
import {Modal, ModalContent, ModalHeader, Tab, Tabs} from "react-lightning-design-system";

import "./styles/styles.css";

const DEFAULT_TAB_KEY = "1";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSelectTab = this.handleSelectTab.bind(this);
        this.state = {
            opened: false,
            loading: false,
            user: null,
            activeTabKey: DEFAULT_TAB_KEY
        }
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: Events.SETTINGS.OPEN,
            callback: event => {
                const user = event.detail;
                this.openModal(user);
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

    openModal(user) {
        this.setState({
            opened: true,
            user: user,
            activeTabKey: DEFAULT_TAB_KEY
        });
    }

    hideModal() {
        this.setState({opened: false, user: null});
    }

    handleSelectTab(tabKey) {
        const {loading} = this.state;
        if (!loading) {
            this.setState({activeTabKey: tabKey.toString()});
        }
    }

    render() {
        const {user, loading, opened, activeTabKey} = this.state;
        if (!user) return <span/>;
        return (
            <Modal opened={opened} onHide={this.hideModal}>
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
        );
    }
}

export default Settings;