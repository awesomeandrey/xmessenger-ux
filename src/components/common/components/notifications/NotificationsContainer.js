import React, {useEffect} from "react";
import NotificationEvents from "./notification-events";
import AlertContainer from "@salesforce/design-system-react/module/components/alert/container";
import Alert from "@salesforce/design-system-react/module/components/alert";
import Button from "@salesforce/design-system-react/module/components/button";
import Icon from "@salesforce/design-system-react/module/components/icon";

import {CustomEvents} from "../../../../model/services/utility/EventsService";
import {Utility} from "../../../../model/services/utility/UtilityService";

class NotificationsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationsMap: new Map(),
            lastNotification: null
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: NotificationEvents.SHOW,
            callback: event => {
                const notificationData = event.detail, {notificationsMap} = this.state;
                const notificationKey = Utility.generateUniqueId();
                if (!notificationsMap.has(notificationKey)) {
                    const notificationDetails = Object.assign({
                        key: notificationKey,
                        level: "info",
                        dismissible: true,
                        onHide: _ => this.hideNotification(notificationKey)
                    }, notificationData);
                    this.setState({
                        notificationsMap: notificationsMap.set(notificationKey, notificationDetails),
                        lastNotification: notificationDetails
                    });
                }
            }
        });
    }

    hideNotification(notificationKeyToRemove) {
        const {notificationsMap} = this.state;
        if (notificationsMap.delete(notificationKeyToRemove)) {
            this.setState({notificationsMap});
        }
    }

    render() {
        const {notificationsMap, lastNotification} = this.state, notificationElements = [...notificationsMap.values()]
            .map(notificationDetails => <Notification {...notificationDetails}/>);
        return (
            <div className="notifications__container">
                <div className="slds-notification-container mobile-hidden">{notificationElements}</div>
                <MobileNotification {...lastNotification}/>
                {this.props.children}
            </div>
        );
    }
}

const MobileNotification = props => {
    const {level, message, dismissible, onHide} = props;
    if (Utility.isObjectEmpty(message)) return <span/>;
    // "success" option is not supported by 'Alert' component;
    const variant = level === "success" ? "info" : level;
    return (
        <AlertContainer className="mobile-visible-only">
            <Alert variant={variant} // ['error', 'info', 'offline', 'warning']
                   dismissible={dismissible}
                   labels={{heading: message}}
                   onRequestClose={onHide}/>
        </AlertContainer>
    );
};

const Notification = props => {
    const {level, message, dismissible, onHide} = props;

    useEffect(_ => {
        if (dismissible) {
            setTimeout(onHide, 3500);
        }
    }, []);

    const colorVariant = ["success", "info"].includes(level) ? "light" : level;
    return (
        <section className="slds-notification" role="dialog">
            <div className="slds-notification__body">
                <a className="slds-notification__target slds-media" href="javascript:void(0);">
                    <Icon category="utility"
                          colorVariant={colorVariant} // ['base', 'default', 'warning', 'error', 'light']
                          name={level} // ['success', 'info', 'warning', 'error']
                    />
                    <div className="slds-media__body slds-p-left--medium">
                        <h2 className="slds-text-heading_small slds-m-bottom_xx-small">{message}</h2>
                    </div>
                </a>
                <Button iconCategory="utility"
                        iconName="close"
                        iconSize="small"
                        iconVariant="bare"
                        onClick={onHide}
                        className="slds-notification__close"
                        variant="icon"/>
            </div>
        </section>
    );
};

export default NotificationsContainer;