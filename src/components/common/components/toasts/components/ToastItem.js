import React from "react";
import ToastEvents from "../events";

import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {Toast} from "react-lightning-design-system";

import "../styles/styles.css";

class ToastItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            delay: 3500
        };
    }

    componentDidMount() {
        setTimeout(this.handleClose, this.state.delay);
    }

    handleClose() {
        CustomEvents.fire({eventName: ToastEvents.CLOSE, detail: this.props.data.id});
    }

    render() {
        const data = this.props.data;
        return (
            <Toast icon={data.icon}
                   className="toast-item"
                   level={data.level}
                   onClose={this.handleClose}>
                {data.message}
            </Toast>
        );
    }
}

export default ToastItem;