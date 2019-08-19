import React from "react";
import ProfileCard from "./components/profile-card/ProfileCard";
import ChatsTab from "./components/tabs/chats/ChatsTab";
import RequestsTab from "./components/tabs/requests/RequestsTab";
import SearchTab from "./components/tabs/search/SearchTab";
import ApplicationEvents from "../../../../../model/application-events";
import GitHubLink from "../../../../common/components/github-link/GitHubLink";
import AppContext from "../../../../../model/services/context/AppContext";
import Tabs from "@salesforce/design-system-react/module/components/tabs";
import TabsPanel from "@salesforce/design-system-react/module/components/tabs/panel";

import {SessionStorage, SessionEntities} from "../../../../../model/services/utility/StorageService";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";

import "./styles/styles.css";

class ProfileInfoPanel extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectTab = this.handleSelectTab.bind(this);
        this.state = {
            chatsAmount: 0,
            requestsAmount: 0,
            activeTabKey: 0
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.CALCULATE,
            callback: event => this.setState({chatsAmount: event.detail})
        });
        CustomEvents.register({
            eventName: ApplicationEvents.REQUEST.CALCULATE,
            callback: event => {
                let requestsAmount = event.detail;
                this.setState({requestsAmount: requestsAmount > 5 ? "5+" : requestsAmount});
            }
        });
        const activeTabKey = SessionStorage.getItem(SessionEntities.ACTIVE_TAB_KEY);
        this.handleSelectTab(activeTabKey || 0);
    }

    handleSelectTab(activeTabKey) {
        SessionStorage.setItem({key: SessionEntities.ACTIVE_TAB_KEY, value: activeTabKey});
        this.setState({activeTabKey});
    }

    render() {
        const {chatsAmount, requestsAmount, activeTabKey} = this.state;
        return (
            <AppContext.Consumer>
                {context => (
                    <div id="profile-info-panel" className="slds-card height-inherit theme-marker--border">
                        <div className="slds-card__header slds-m-bottom_none slds-p-bottom_medium theme-marker">
                            <ProfileCard user={context.user}/>
                        </div>
                        <div className="slds-card__body">
                            <Tabs onSelect={this.handleSelectTab} selectedIndex={activeTabKey}
                                  className="height-percent-100">
                                <TabsPanel label={<TabItem title="chats" amount={chatsAmount}/>}>
                                    <ChatsTab user={context.user}/>
                                </TabsPanel>
                                <TabsPanel label={<TabItem title="requests" amount={requestsAmount}/>}>
                                    <RequestsTab user={context.user}/>
                                </TabsPanel>
                                <TabsPanel label={<TabItem title="search"/>}>
                                    <SearchTab/>
                                </TabsPanel>
                            </Tabs>
                        </div>
                        <footer className="slds-card__footer position-bottom theme-marker mobile-hidden">
                            <GitHubLink/>
                        </footer>
                    </div>
                )}
            </AppContext.Consumer>
        );
    }
}

const TabItem = ({title, amount}) => {
    return (
        <div className="hoverable">
            <span>{title}</span>&nbsp;
            {amount !== 0 && <span className="slds-badge" style={{verticalAlign: "middle"}}>{amount}</span>}
        </div>
    );
};

export default ProfileInfoPanel;