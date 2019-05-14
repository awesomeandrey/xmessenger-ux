import React from "react";
import Image from "../plain/Image";
import ScalableImage from "../scalable/ScalableImage";
import Indicator from "./status-indicator/Indicator";
import AppContext from "../../../../../model/services/context/AppContext";

import {UserService} from "../../../../../model/services/core/UserService";

const UserPicture = props => {
    const {user, scalable = true} = props, title = user.name, pictureUrl = UserService.composeUserPictureUrl(user);
    return (
        <AppContext.Consumer>
            {context => (
                <Indicator {...context} user={user}>
                    <div className="slds-avatar slds-avatar_large">
                        {scalable ? <ScalableImage title={title} src={pictureUrl}/> :
                            <Image title={title} src={pictureUrl}/>}
                    </div>
                </Indicator>
            )}
        </AppContext.Consumer>
    );
};

export default UserPicture;