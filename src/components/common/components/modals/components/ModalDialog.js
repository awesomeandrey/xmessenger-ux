import React from "react";
import ModalEvents from "../events";

import {Modal, ModalHeader, ModalContent, ModalFooter, Button} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";

const DEFAULT_STATE = {
    opened: false,
    title: "",
    body: "",
    actionButton: {
        type: "",
        label: "",
        callback: null
    }
};

class ModalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.handleActionBtn = this.handleActionBtn.bind(this);
        this.state = DEFAULT_STATE;
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: ModalEvents.SHOW,
            callback: event => {
                this.setState({...event.detail, opened: true});
            }
        });
    }

    hideModal() {
        this.setState(DEFAULT_STATE);
    }

    handleActionBtn() {
        const {actionButton} = this.state;
        if (!!actionButton && typeof actionButton.callback === "function") {
            actionButton.callback(); // execute callback;
        }
        this.hideModal();
    }

    render() {
        const {opened, title, body, actionButton} = this.state;
        return (
            <Modal opened={opened} onHide={this.hideModal}>
                <ModalHeader title={title} closeButton/>
                <ModalContent className="slds-p-around--small">
                    <p>{body}</p>
                </ModalContent>
                <ModalFooter>
                    <Button type="neutral" label="Cancel" onClick={this.hideModal}/>
                    <Button type={actionButton.type || "brand"} label={actionButton.label || "Done"}
                            onClick={this.handleActionBtn}/>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalDialog;