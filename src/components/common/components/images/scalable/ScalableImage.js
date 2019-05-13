import React from "react";
import Image from "../plain/Image";
import ModalEvents from "../../modals/modals-events";

import {Utility} from "../../../../../model/services/utility/UtilityService";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";

import "./styles.css";

const ScalableImage = initProps => {
    let props = Object.assign({}, initProps);
    props.className = Utility.join("scalable-image", props.className || "");
    return (
        <Image {...props} onClick={event => {
            CustomEvents.fire({eventName: ModalEvents.SHOW_IMAGE, detail: event.target});
        }}/>
    );
};

export default ScalableImage;