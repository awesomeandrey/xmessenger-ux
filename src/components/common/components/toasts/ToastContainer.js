import React from "react";
import ToastEvents from "./events";
import AlertContainer from "@salesforce/design-system-react/module/components/alert/container";
import Alert from "@salesforce/design-system-react/module/components/alert";
import Toast from "@salesforce/design-system-react/module/components/toast";

import {CustomEvents} from "../../../../model/services/utility/EventsService";
import {Utility} from "../../../../model/services/utility/UtilityService";

import "./styles.css";

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
                // Adjust to SLDS components structure;
                const toastKey = Utility.generateUniqueId(), toastItem = {
                    key: toastKey,
                    variant: toastData.level,
                    labels: {heading: toastData.message},
                    dismissible: true,
                    onRequestClose: _ => this.setState({toasts: toasts.filter(toastItem => toastItem.key !== toastKey)})
                };
                this.setState({toasts: [...toasts, toastItem], mobileAlert: toastItem});
            }
        });
    }

    render() {
        const {toasts, mobileAlert} = this.state;
        return (
            <div className="toasts-container">
                <div className="slds-is-fixed slds-notify_container mobile-hidden">
                    {(toasts.map(toastItem =>
                        <div key={toastItem.key} className="toast-item"><Toast {...toastItem} duration={3500}/></div>))}
                </div>
                <MobileAlert mobileAlert={mobileAlert} onClose={_ => this.setState({mobileAlert: null})}/>
                {this.props.children}
            </div>
        );
    }
}

const MobileAlert = props => {
    const {mobileAlert, onClose} = props;
    if (Utility.isObjectEmpty(mobileAlert)) return <span/>;
    if (mobileAlert.variant === "success") {
        // "success" option is not supported by 'Alert' component;
        mobileAlert.variant = "info";
    }
    return (
        <AlertContainer className="mobile-visible-only">
            <Alert {...mobileAlert} onRequestClose={onClose}/>
        </AlertContainer>
    );
};

export default ToastContainer;