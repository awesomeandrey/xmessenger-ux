import React from "react";
import ModalEvents from "../../../../../../../common/components/modals/modals-events";
import UserPicture from "../../../../../../../common/components/images/user-picture/UserPicture";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";
import Dropdown from "@salesforce/design-system-react/module/components/menu-dropdown";
import ApplicationEvents from "../../../../../../../../model/application-events";

import {ChattingService} from "../../../../../../../../model/services/core/ChattingService";
import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";

const _onRemoveChat = chat => {
    const modalDetails = {
        title: "Remove chat",
        body: `Do you want to remove chat with ${chat["fellow"]["name"]}?`,
        actionButton: {
            type: "destructive",
            label: "Remove",
            callback: _ => {
                CustomEvents.fire({eventName: ApplicationEvents.CHAT.DELETE, detail: {removedChat: chat}})
                    .then(_ => ChattingService.removeChat(chat));
            }
        }
    };
    CustomEvents.fire({eventName: ModalEvents.SHOW_DIALOG, detail: modalDetails});
}, _onClearChat = chat => {
    const modalDetails = {
        title: "Clear chat history",
        body: `Do you want to delete all messages with ${chat["fellow"]["name"]}?`,
        actionButton: {
            type: "destructive",
            label: "Clear",
            callback: _ => {
                CustomEvents.fire({eventName: ApplicationEvents.CHAT.CLEAR, detail: {clearedChat: chat}})
                    .then(_ => ChattingService.clearChat(chat));
            }
        }
    };
    CustomEvents.fire({eventName: ModalEvents.SHOW_DIALOG, detail: modalDetails});
};

export default props => {
    const {chat, selected, onClick} = props, {fellow} = chat;
    return (
        <div className={`chat-item ${selected && "theme-marker"}`} onClick={onClick}>
            <MediaObject className="slds-box slds-box_x-small"
                         figure={<UserPicture user={fellow} scalable={false}/>}
                         body={
                             <div className="flex-container flex-container__space-between">
                                 <p className="slds-float_left">
                                     <span className="slds-text-body_regular">{fellow["name"]}</span><br/>
                                     <span className="slds-text-color_weak theme-inherit">
                                        <span>{Utility.decorateUsername(fellow["username"])}</span>
                                        <span>{!selected && Utility.appendDateStamp(chat["lastActivityDate"])}</span>
                                    </span>
                                 </p>
                                 <div className="slds-float_right">
                                     <Dropdown iconCategory="utility"
                                               iconVariant="border-filled"
                                               iconName="down"
                                               onSelect={option => {
                                                   switch (option.value) {
                                                       case 1:
                                                           _onClearChat(chat);
                                                           break;
                                                       case 2:
                                                           _onRemoveChat(chat);
                                                           break;
                                                   }
                                               }}
                                               options={[
                                                   {label: "Clear history", value: 1},
                                                   {label: "Remove", value: 2},
                                               ]}/>
                                 </div>
                             </div>
                         }/>
        </div>
    );
};