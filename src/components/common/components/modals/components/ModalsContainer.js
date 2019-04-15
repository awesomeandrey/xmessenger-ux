import React from "react";

import Modal from "@salesforce/design-system-react/module/components/modal";
import ModalEvents from "../events";

import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {Utility} from "../../../../../model/services/utility/UtilityService";

import "../styles/styles.css";
import Button from "@salesforce/design-system-react/module/components/button";

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
            eventName: ModalEvents.IMAGE.SHOW,
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
            eventName: ModalEvents.SHOW,
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

    render() {
        const {opened, descriptor} = this.state, hasConfigs = !Utility.isObjectEmpty(descriptor);
        return (
            <div className="modals-container">
                <Modal isOpen={hasConfigs && opened} title={descriptor.title} dismissible
                       onRequestClose={_ => this.setState(_defaultState)}>
                    {!!descriptor.imageNode ? <ModalImage imageNode={descriptor.imageNode}/> : <span/>}
                    {!!descriptor.dialog ? <ModalDialog dialog={descriptor.dialog}/> : <span/>}
                </Modal>
                {this.props.children}
            </div>
        );
    }
}

const ModalDialog = props => {
    const {} = props;
    return (
        <div className="slds-show">
            <div className="slds-modal__content slds-p-around_small">
                <p>{body}</p>
            </div>
            <footer className="slds-modal__footer">
                <Button type="neutral" label="Cancel" onClick={this.hideModal}/>
                <Button type={actionButton.type || "brand"} label={actionButton.label || "Done"}
                        onClick={this.handleActionBtn}/>
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