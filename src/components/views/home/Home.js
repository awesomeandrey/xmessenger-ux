import React from 'react';
import SessionValidator from "../../common/model/SessionValidator";
import ChatterPanel from "./components/chatter-container/ChatterPanel";
import ProfileInfoPanel from "./components/profile-container/ProfileInfoPanel";
import AppContextProvider from "../../../model/services/context/AppContextProvider";
import subscribeToTopics from "../../../model/api/streaming/TopicsSubscriber";

import {Utility} from "../../../model/services/utility/UtilityService";
import {getCurrentTheme, applyTheme} from "../../../model/services/utility/ThemingService";

import "./styles/styles.css";

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        subscribeToTopics();
        applyTheme(getCurrentTheme());
    }

    render() {
        const commonClass = "slds-col slds-size_1-of-1 slds-p-around_xxx-small height-screen";
        return (
            <AppContextProvider>
                <div className="home-container slds-grid slds-p-around_small slds-wrap">
                    <div className={Utility.join(commonClass, "slds-medium-size_5-of-12", "slds-large-size_4-of-12")}>
                        <ProfileInfoPanel/>
                    </div>
                    <div className={Utility.join(commonClass, "slds-medium-size_7-of-12", "slds-large-size_8-of-12")}>
                        <ChatterPanel/>
                    </div>
                </div>
            </AppContextProvider>
        );
    }
}

export default SessionValidator({})(Home);