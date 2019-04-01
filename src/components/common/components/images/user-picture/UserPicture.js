import React from "react";
import Image from "../plain/Image";
import ScalableImage from "../scalable/ScalableImage";

import {UserService} from "../../../../../model/services/core/UserService";

const UserPicture = props => {
    const {user, scalable = true} = props, title = user.name, pictureUrl = UserService.composeUserPictureUrl(user);
    return scalable ? <ScalableImage title={title} src={pictureUrl}/> : <Image title={title} src={pictureUrl}/>;
};

export default UserPicture;