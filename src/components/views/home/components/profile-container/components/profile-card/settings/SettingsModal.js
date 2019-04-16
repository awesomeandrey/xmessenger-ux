import React from "react";
import Events from "../../../../../../../../model/events/application-events";
import ProfileInfo from "./components/ProfileInfo";
import ProfileImage from "./components/ProfileImage";
import PasswordChange from "./components/PasswordChange";
import AccountDeactivation from "./components/AccountDeactivation";
import ThemePicker from "./components/ThemePicker";
import Modal from "@salesforce/design-system-react/module/components/modal";
import Tabs from "@salesforce/design-system-react/module/components/tabs";
import TabsPanel from "@salesforce/design-system-react/module/components/tabs/panel";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";

import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";

class SettingsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            loading: false,
            activeTabKey: 0
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: Events.SETTINGS.OPEN,
            callback: _ => this.setState({opened: true})
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
            this.setState({activeTabKey: tabKey});
        }
    };

    render() {
        const {loading, opened, activeTabKey} = this.state, {user} = this.props, reset = !opened;
        return (
            <Modal isOpen={opened} title="Settings" dismissible={!loading} containerClassName="width-stretch"
                   onRequestClose={_ => this.setState({opened: false, activeTabKey: 0})} ariaHideApp={false}>
                <Tabs variant="scoped" onSelect={this.handleSelectTab} selectedIndex={activeTabKey}>
                    <TabsPanel label="Profile Info">
                        <div className="slds-grid slds-wrap slds-gutters">
                            <div className="slds-col slds-size_1-of-1 slds-medium-size_5-of-12 slds-large-size_6-of-12">
                                <ProfileImage user={user} reset={reset}/>
                            </div>
                            <div className="slds-col slds-size_1-of-1 slds-medium-size_7-of-12 slds-large-size_6-of-12">
                                <ProfileInfo user={user} reset={reset}/>
                            </div>
                        </div>
                    </TabsPanel>
                    <TabsPanel label="Change Password">
                        {user["loggedExternally"]
                            ? <EmptyArea title="No password change." icon="announcement"/>
                            : <PasswordChange user={user} reset={reset}/>}
                    </TabsPanel>
                    <TabsPanel label="Choose Theme">
                        <ThemePicker/>
                    </TabsPanel>
                    <TabsPanel label="Delete Account">
                        <AccountDeactivation user={user} reset={reset}/>
                    </TabsPanel>
                </Tabs>
            </Modal>
        );
    }
}

export default SettingsModal;