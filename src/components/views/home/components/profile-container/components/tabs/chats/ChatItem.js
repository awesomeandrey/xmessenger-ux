import React from "react";
import ModalEvents from "../../../../../../../common/components/modals/events";
import UserPicture from "../../../../../../../common/components/images/user-picture/UserPicture";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";
import Dropdown from "@salesforce/design-system-react/module/components/menu-dropdown";

import {ChattingService} from "../../../../../../../../model/services/core/ChattingService";
import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";

const _formatChatTitle = (username, dateNum) => {
        const dateString = Utility.formatDate({dateNum, showTimestamp: false});
        return (
            <span className="slds-text-color_weak">
            {Utility.decorateUsername(username) + (!!dateString ? (" • " + dateString) : "")}
        </span>
        );
    },
    _onRemoveChat = chatData => {
        const modalDetails = {
            title: "Remove chat",
            body: `Do you want to remove chat with ${chatData.fellow.name}?`,
            actionButton: {
                type: "destructive",
                label: "Remove",
                callback: _ => ChattingService.removeChat(chatData)
            }
        };
        CustomEvents.fire({eventName: ModalEvents.SHOW_DIALOG, detail: modalDetails});
    },
    _onClearChat = chatData => {
        const modalDetails = {
            title: "Clear chat history",
            body: `Do you want to delete all messages with ${chatData.fellow.name}?`,
            actionButton: {
                type: "destructive",
                label: "Clear",
                callback: _ => ChattingService.clearChat(chatData)
            }
        };
        CustomEvents.fire({eventName: ModalEvents.SHOW_DIALOG, detail: modalDetails});
    },
    _onSelectOption = (option, chatData) => {
        switch (option.value) {
            case 1:
                _onClearChat(chatData);
                break;
            case 2:
                _onRemoveChat(chatData);
                break;
        }
    };

export default props => {
    const {chatData, selected} = props, {fellow} = chatData;
    return (
        <MediaObject className="slds-box slds-box_x-small"
                     figure={<div className="slds-avatar slds-avatar_large">
                         <UserPicture user={fellow} scalable={false}/>
                     </div>}
                     body={
                         <div className="slds-clearfix">
                             <p className="slds-float_left">
                                 <span className="slds-text-body_regular">{fellow.name}</span><br/>
                                 {_formatChatTitle(fellow.username, selected ? null : chatData.latestMessageDate)}
                             </p>
                             <div className="slds-float_right">
                                 <Dropdown iconCategory="utility"
                                           iconVariant="border-filled"
                                           iconName="down"
                                           onSelect={opt => _onSelectOption(opt, chatData)}
                                           options={[
                                               {label: "Clear history", value: 1},
                                               {label: "Remove", value: 2},
                                           ]}/>
                             </div>
                         </div>
                     }/>
    );
};