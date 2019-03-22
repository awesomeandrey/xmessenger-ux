import React from "react";
import ModalImage from "./ModalImage";
import ModalDialog from "./ModalDialog";

import "../styles/styles.css";

const ModalsContainer = props => {
    return (
        <div className="modals-container">
            <ModalDialog/>
            <ModalImage/>
            {props.children}
        </div>
    );
};

export default ModalsContainer;