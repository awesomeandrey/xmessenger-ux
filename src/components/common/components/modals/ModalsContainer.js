import React from "react";
import Modal from "@salesforce/design-system-react/module/components/modal";
import ModalEvents from "./events";
import Button from "@salesforce/design-system-react/module/components/button";

import {CustomEvents} from "../../../../model/services/utility/EventsService";
import {Utility} from "../../../../model/services/utility/UtilityService";

const _defaultState = {
    opened: false,
    descriptor: {}
};

class ModalsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = _defaultState;
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: ModalEvents.SHOW_IMAGE,
            callback: event => {
                const imgElement = event.detail;
                this.setState({
                    opened: true, descriptor: {
                        imageNode: {title: imgElement.title, src: imgElement.src, alt: imgElement.alt}
                    }
                });
            }
        });
        CustomEvents.register({
            eventName: ModalEvents.SHOW_DIALOG,
            callback: event => {
                const {detail} = event;
                this.setState({
                    opened: true, descriptor: {
                        dialog: {...detail}
                    }
                });
            }
        });
    }

    onCloseModal = _ => this.setState(_defaultState);

    render() {
        const {opened, descriptor} = this.state, hasConfigs = !Utility.isObjectEmpty(descriptor);
        return (
            <div className="modals-container">
                <Modal isOpen={hasConfigs && opened} title={!!descriptor.dialog && descriptor.dialog.title}
                       dismissible onRequestClose={this.onCloseModal}>
                    {!!descriptor.imageNode
                        ? <ModalImage imageNode={descriptor.imageNode}/> : <span/>}
                    {!!descriptor.dialog
                        ? <ModalDialog dialog={descriptor.dialog} onClose={this.onCloseModal}/> : <span/>}
                </Modal>
                {this.props.children}
            </div>
        );
    }
}

const ModalDialog = props => {
    const {dialog, onClose} = props, {body, actionButton} = dialog;
    return (
        <div className="slds-show">
            <div className="slds-modal__content slds-p-around_small">
                <p>{body}</p>
            </div>
            <footer className="slds-modal__footer">
                <Button variant="neutral" label="Cancel" onClick={onClose}/>
                <Button variant={actionButton.type || "brand"} label={actionButton.label || "Done"}
                        onClick={_ => {
                            if (!!actionButton && typeof actionButton.callback === "function") {
                                actionButton.callback(); // execute callback;
                            }
                            onClose();
                        }}/>
            </footer>
        </div>
    );
};

const ModalImage = props => {
    const {imageNode} = props;
    return (
        <div className="slds-show">
            <div className="slds-modal__content slds-p-around_small">
                 <span className="slds-align_absolute-center">
                     <img alt={imageNode.alt} src={imageNode.src} title={imageNode.title}/>
                </span>
            </div>
            <footer className="slds-modal__footer">
                <div className="slds-text-heading_small slds-text-align_center">{imageNode.title}</div>
            </footer>
        </div>
    );
};

export default ModalsContainer;