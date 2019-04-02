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
            toasts: new Map()
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: ToastEvents.SHOW,
            callback: event => {
                const toastData = event.detail;
                toastData.id = Utility.generateHashValue(toastData);
                this.setState({toasts: this.state.toasts.set(toastData.id, toastData)});
            }
        });
        CustomEvents.register({
            eventName: ToastEvents.CLOSE,
            callback: event => {
                const toastId = event.detail;
                const toastsMap = this.state.toasts;
                if (toastsMap.has(toastId)) {
                    toastsMap.delete(toastId);
                    this.setState({toasts: toastsMap});
                }
            }
        });
    }

    render() {
        const toastItems = [];
        this.state.toasts.forEach((toastItem, key) => {
            toastItems.push(<ToastItem key={key} data={toastItem}/>);
        });
        return (
            <div className="toasts-container">
                <div className="slds-is-fixed slds-notify_container">{toastItems}</div>
                {this.props.children}
            </div>
        );
    }
}

export default ToastContainer;