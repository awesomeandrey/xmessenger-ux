import React from 'react';
import SessionValidator from "../../common/model/SessionValidator";
import ChatPanel from "./components/chatter-container/ChatPanel";
import ProfilePanel from "./components/profile-container/ProfilePanel";
import ToastContainer from "../../common/components/toasts/components/ToastContainer";
import ModalsContainer from "../../common/components/modals/components/ModalsContainer";
import AppContextProvider from "../../../model/services/context/AppContextProvider";

import {Utility} from "../../../model/services/utility/UtilityService";
import {getCurrentTheme, applyTheme} from "../../../model/services/utility/ThemingService";
import {registerServerListeners} from "./model/WebSocketListener";

import "./styles/styles.css";

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        registerServerListeners();
        applyTheme(getCurrentTheme());
    }

    render() {
        const columnClassName = "slds-col slds-size_1-of-1 slds-p-around_xxx-small height-screen";
        return (
            <AppContextProvider>
                <ModalsContainer>
                    <ToastContainer>
                        <div className="Home container slds-grid slds-p-around_small slds-wrap">
                            <div className={Utility.join(columnClassName, "slds-medium-size_5-of-12", "slds-large-size_4-of-12")}>
                                <ProfilePanel/>
                            </div>
                            <div className={Utility.join(columnClassName, "slds-medium-size_7-of-12", "slds-large-size_8-of-12")}>
                                <ChatPanel/>
                            </div>
                        </div>
                    </ToastContainer>
                </ModalsContainer>
            </AppContextProvider>
        );
    }
}

export default SessionValidator({})(Home);