import React from "react";
import Image from "../plain/Image";
import ScalableImage from "../scalable/ScalableImage";
import Indicator from "../../indicator/Indicator";

import {UserService} from "../../../../../model/services/core/UserService";

const UserPicture = props => {
    const {hasIndicator = true} = props;
    return (
        hasIndicator
            ? <UserPictureWithIndicator {...props}/>
            : <UserPictureWithoutIndicator {...props}/>
    );
};

const UserPictureWithIndicator = props => {
    return (
        <Indicator user={props.user}>
            <UserPictureWithoutIndicator {...props}/>
        </Indicator>
    );
};

const UserPictureWithoutIndicator = props => {
    const {user, scalable = true} = props, pictureUrl = UserService.composeUserPictureUrl(user), title = user.name;
    return (
        <div className="slds-avatar slds-avatar_large">
            {scalable ? <ScalableImage title={title} src={pictureUrl}/> : <Image title={title} src={pictureUrl}/>}
        </div>
    );
};

export default UserPicture;