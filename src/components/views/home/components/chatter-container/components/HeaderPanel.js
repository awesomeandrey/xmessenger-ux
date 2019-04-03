import React from "react";
import UserPicture from "../../../../../common/components/images/user-picture/UserPicture";
import PropsLoader from "../../../../../common/components/loader/PropsLoader";

import {Button} from "react-lightning-design-system";

const HeaderPanel = props => {
    const {chat} = props, {fellow} = chat;
    return (
        <div className="theme-marker slds-card__header slds-grid slds-theme_shade slds-p-bottom--medium slds-m-bottom--small">
            <header className="slds-media slds-media_center slds-has-flexi-truncate">
                <div className="slds-media__figure">
                    <div className="slds-avatar slds-avatar_large"><UserPicture user={fellow}/></div>
                </div>
                <div className="slds-media__body">
                    <h2>
                        <span className="slds-card__header slds-truncate">
                            <span className="slds-text-heading_small">{fellow.name}</span>
                        </span>
                    </h2>
                </div>
            </header>
            <div className="slds-no-flex">
                <Button type="neutral" onClick={_ => {
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                }} className="slds-m-top_x-small mobile-visible-only">Back</Button>
            </div>
        </div>
    );
};

export default PropsLoader("chat")(HeaderPanel);