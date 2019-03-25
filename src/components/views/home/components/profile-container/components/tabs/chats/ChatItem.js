import React from "react";
import ScalableImage from "../../../../../../../common/components/images/scalable/ScalableImage";
import Events from "../../../../../model/HomePageEvents";
import ModalEvents from "../../../../../../../common/components/modals/events";
import DnDEvents from "../../../../../../../common/components/dnd/events";

import {ChattingService} from "../../../../../../../../model/services/core/ChattingService";
import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";
import {ItemTypes} from "../../../../../../../common/components/dnd/ItemTypes";
import {DragSource} from "react-dnd";
import {DropdownButton, DropdownMenuItem} from "react-lightning-design-system";
import {UserService} from "../../../../../../../../model/services/core/UserService";

const chatItemSource = {
    beginDrag(props) {
        if (Utility.isMobileDevice()) return {};
        CustomEvents.fire({eventName: DnDEvents.DELETE_CHAT_DRAG});
        return props.data;
    },
    endDrag(props, monitor) {
        CustomEvents.fire({eventName: DnDEvents.DELETE_CHAT_DROP});
        let dropResult = monitor.getDropResult();
        if (!!dropResult && !!dropResult.chatItem) {
            ChatItem.handleRemoveChat(dropResult.chatItem);
        }
    }
};

@DragSource(ItemTypes.CHAT, chatItemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource()
}))
export default class ChatItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectChat = this.handleSelectChat.bind(this);
        this.handleClearHistory = this.handleClearHistory.bind(this);
        this.state = {};
    }

    handleSelectChat(event) {
        if (event.target.nodeName !== 'BUTTON') {
            CustomEvents.fire({
                eventName: Events.CHAT.SELECT,
                detail: {
                    selectedChat: this.props.data
                }
            });
        }
    }

    /*
     * This method is 'static' as it's used in DnD process;
     */
    static handleRemoveChat(chatEntity) {
        let modalDetails = {
            title: "Remove chat",
            body: `Do you want to remove chat with ${chatEntity.fellow.name}?`,
            actionButton: {
                type: "destructive",
                label: "Remove",
                callback: _ => ChattingService.removeChat(chatEntity)
            }
        };
        CustomEvents.fire({eventName: ModalEvents.SHOW, detail: modalDetails});
    }

    handleClearHistory() {
        const {data} = this.props, chatEntity = data;
        let modalDetails = {
            title: "Clear chat history",
            body: `Do you want to delete all messages with ${chatEntity.fellow.name}?`,
            actionButton: {
                type: "destructive",
                label: "Clear",
                callback: _ => ChattingService.clearChat(chatEntity)
            }
        };
        CustomEvents.fire({eventName: ModalEvents.SHOW, detail: modalDetails});
    }

    render() {
        const {connectDragSource, data, selected} = this.props, {fellow} = data,
            dateString = selected ? null : Utility.formatDate({dateNum: data.latestMessageDate, showTimestamp: false});
        return connectDragSource(
            <div className={`chat slds-media slds-box slds-box_x-small slds-p-vertical--x-small slds-m-top_x-small
                ${selected && 'selected'}`} onClick={this.handleSelectChat}>
                <div className="slds-media__figure">
                    <div className="slds-avatar slds-avatar_large">
                        <ScalableImage title={fellow.name} src={UserService.composeUserPictureUrl(fellow)}/>
                    </div>
                </div>
                <div className="slds-media__body">
                    <p className="slds-float_left">
                        <span className="slds-text-body_regular">{fellow.name}</span><br/>
                        <span>
                            {Utility.decorateUsername(fellow.username) + (!!dateString ? " • " + dateString : "")}
                        </span>
                    </p>
                    <DropdownButton type="icon-border" className="slds-float_right" icon="down">
                        <DropdownMenuItem onClick={this.handleClearHistory}>
                            Clear history
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={_ => ChatItem.handleRemoveChat(data)}>
                            Remove
                        </DropdownMenuItem>
                    </DropdownButton>
                </div>
            </div>
        );
    }
}