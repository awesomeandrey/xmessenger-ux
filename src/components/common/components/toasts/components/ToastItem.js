import React from "react";
import ToastEvents from "../events";

import {CustomEvents} from "../../../../../model/services/utility/EventsService";
// import {Toast} from "react-lightning-design-system";

import "../styles/styles.css";

class ToastItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 3500
        };
    }

    componentDidMount() {
        setTimeout(this.handleClose, this.state.delay);
    }

    handleClose = _ => {
        const {data} = this.props;
        CustomEvents.fire({eventName: ToastEvents.CLOSE, detail: data.key});
    };

    render() {
        const {data} = this.props;
        return (
            <span/>
        );
    }
}

export default ToastItem;