import React from 'react';
import ToastEvents from "../events";
import ToastItem from "./ToastItem";

// import {Alert} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {Utility} from "../../../../../model/services/utility/UtilityService";

import "../styles/styles.css";

class ToastContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileAlert: null,
            toasts: []
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: ToastEvents.SHOW,
            callback: event => {
                const toastData = event.detail, {toasts} = this.state;
                toastData.key = Utility.generateUniqueId();
                this.setState({toasts: [...toasts, toastData], mobileAlert: toastData});
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
        const {toasts, mobileAlert} = this.state,
            toastItems = toasts.map(toastItem => <ToastItem key={toastItem.key} data={toastItem}/>);
        return (
            <div className="toasts-container">
                {/*<div className="slds-is-fixed slds-notify_container mobile-hidden">{toastItems}</div>*/}
                {/*{!!mobileAlert && <Alert {...mobileAlert} className="mobile-visible-only"*/}
                                         {/*onClose={_ => this.setState({mobileAlert: null})}>*/}
                    {/*{mobileAlert.message}</Alert>}*/}
                {this.props.children}
            </div>
        );
    }
}

export default ToastContainer;