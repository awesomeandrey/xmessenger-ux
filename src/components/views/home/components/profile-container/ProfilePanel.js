import React from "react";
import ProfileCard from "./components/profile-card/ProfileCard";
import ChatsTab from "./components/tabs/chats/ChatsTab";
import RequestsTab from "./components/tabs/requests/RequestsTab";
import SearchTab from "./components/tabs/search/SearchTab";
import Events from "../../../../../model/events/application-events";
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';
import GitHubLink from "../../../../common/components/github-link/GitHubLink";
import AppContext from "../../../../../model/services/context/AppContext";

import {Tabs, Tab, Icon} from "react-lightning-design-system";
import {SessionStorage, SessionEntities} from "../../../../../model/services/utility/StorageService";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {DragDropContext} from "react-dnd/lib/index";

import "./styles/styles.css";

class ProfilePanel extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectTab = this.handleSelectTab.bind(this);
        this.state = {
            chatsAmount: 0,
            requestsAmount: 0,
            activeTabKey: "1" // should be of 'string' type;
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: Events.CHAT.CALCULATE,
            callback: event => this.setState({chatsAmount: event.detail})
        });
        CustomEvents.register({
            eventName: Events.REQUEST.CALCULATE,
            callback: event => this.setState({requestsAmount: event.detail})
        });

        const activeTabKey = SessionStorage.getItem(SessionEntities.ACTIVE_TAB_KEY);
        if (!!activeTabKey) {
            this.handleSelectTab(activeTabKey);
        }
    }

    handleSelectTab(activeTabKey) {
        activeTabKey = activeTabKey.toString();
        SessionStorage.setItem({key: SessionEntities.ACTIVE_TAB_KEY, value: activeTabKey});
        this.setState({activeTabKey: activeTabKey});
    }

    render() {
        const {chatsAmount, requestsAmount, activeTabKey} = this.state,
            searchTab = (<div>SEARCH <Icon icon="standard:search" size="small"/></div>);
        return (
            <AppContext.Consumer>
                {context => (
                    <div className="slds-card height-inherit theme-marker--border">
                        <div className="theme-marker slds-card__header slds-m-bottom_none slds-p-bottom_medium">
                            <ProfileCard user={context.user} reloadUser={context.reloadUser}/>
                        </div>
                        <div className="slds-card__body tabs-container">
                            <Tabs type="default" activeKey={activeTabKey}
                                  className="height-percent-100" onSelect={this.handleSelectTab}>
                                <Tab eventKey="1" className="height-inherit slds-p-top_none"
                                     title={<TabItem title="chats" amount={chatsAmount}/>}>
                                    <ChatsTab user={context.user}/>
                                </Tab>
                                <Tab eventKey="2" className="height-inherit slds-p-top_none"
                                     title={<TabItem title="requests" amount={requestsAmount}/>}>
                                    <RequestsTab user={context.user}/>
                                </Tab>
                                <Tab eventKey="3" title={searchTab} className="height-inherit">
                                    <SearchTab/>
                                </Tab>
                            </Tabs>
                        </div>
                        <footer className="theme-marker slds-card__footer position-bottom slds-align_absolute-center">
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
        <div>
            <span>{title}</span>&nbsp;
            {amount !== 0 && <span className="slds-badge" style={{verticalAlign: "middle"}}>{amount}</span>}
        </div>
    );
};

export default DragDropContext(MultiBackend(HTML5toTouch))(ProfilePanel);