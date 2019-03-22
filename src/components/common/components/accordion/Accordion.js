import React from 'react';
import {Icon} from "react-lightning-design-system";
import {Utility} from "../../../../model/services/utility/UtilityService";

export const Accordion = (props) => {
    let containerClassName = Utility.join("slds-accordion", props.className || "");
    return (
        <ul className={containerClassName}>
            {props.children}
        </ul>
    );
};

export class AccordionSection extends React.Component {
    constructor(props) {
        super(props);
        this.handleSectionClick = this.handleSectionClick.bind(this);
        this.state = {
            title: "Section Name",
            isOpened: false,
            openedClassName: "slds-is-open"
        };
    }

    handleSectionClick(event) {
        event.preventDefault();
        const isOpened = this.state.isOpened;
        if (typeof isOpened === 'boolean' && isOpened) {
            this.setState({isOpened: false}); // close;
        } else {
            this.setState({isOpened: true}); // open;
        }
    }

    render() {
        const title = this.props.title || this.state.title, isOpened = this.state.isOpened;
        const containerClassName = isOpened ? "slds-is-open" : "";
        const buttonIcon = isOpened ? "chevrondown" : "chevronright"; // SLDS icons;
        return (
            <li className="slds-accordion__list-item">
                <section className={containerClassName}>
                    <div className="slds-accordion__summary">
                        <p className="slds-accordion__summary-heading">
                            <button className="slds-button slds-button_reset slds-accordion__summary-action"
                                    onClick={this.handleSectionClick} type="button">
                                <Icon icon={buttonIcon} size="x-small"/>&nbsp;
                                <span className="slds-truncate">{title}</span>
                            </button>
                        </p>
                    </div>
                    <div className="slds-accordion__content">
                        {this.props.children}
                    </div>
                </section>
            </li>
        );
    }
}