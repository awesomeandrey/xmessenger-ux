import React from "react";
import ModalEvents from "../events";

import {Modal, ModalHeader, ModalContent, ModalFooter} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";

const DEFAULT_STATE = {
    opened: false,
    imageNode: {}
};

class ModalImage extends React.Component {
    constructor(props) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.state = DEFAULT_STATE;
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: ModalEvents.IMAGE.SHOW,
            callback: event => {
                const imgElement = event.detail;
                this.setState({
                    opened: true,
                    imageNode: {
                        title: imgElement.title,
                        src: imgElement.src,
                        alt: imgElement.alt
                    }
                });
            }
        });
    }

    hideModal() {
        this.setState(DEFAULT_STATE);
    }

    render() {
        const {opened, imageNode} = this.state;
        return (
            <Modal opened={opened} onHide={this.hideModal}>
                <ModalHeader title="Profile picture" closeButton/>
                <ModalContent className="slds-p-around--small">
                    <span className="slds-align_absolute-center">
                        <img alt={imageNode.alt} src={imageNode.src} title={imageNode.title}/>
                    </span>
                </ModalContent>
                <ModalFooter>
                    <div className="slds-text-heading_small slds-text-align_center">{imageNode.title}</div>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalImage;