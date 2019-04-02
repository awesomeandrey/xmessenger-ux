import React from 'react';
import ToastEvents from "../events";
import ToastItem from "./ToastItem";

import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {Utility} from "../../../../../model/services/utility/UtilityService";

import "../styles/styles.css";

class ToastContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toasts: []
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: ToastEvents.SHOW,
            callback: event => {
                const toastData = event.detail, {toasts} = this.state;
                toastData.key = Utility.generateUniqueId();
                toasts.push(toastData);
                this.setState({toasts: toasts});
            }
        });
        CustomEvents.register({
            eventName: ToastEvents.CLOSE,
            callback: event => {
                const toastKeyToDismiss = event.detail, {toasts} = this.state;
                this.setState({toasts: toasts.filter(toastItem => toastItem.key !== toastKeyToDismiss)})
            }
        });
    }

    render() {
        const toastItems = this.state.toasts.map(toastItem => <ToastItem key={toastItem.key} data={toastItem}/>);
        return (
            <div className="toasts-container">
                <div className="slds-is-fixed slds-notify_container">{toastItems}</div>
                {this.props.children}
            </div>
        );
    }
}

export default ToastContainer;