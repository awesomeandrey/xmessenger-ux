import React from "react";
import Events from "../../../../../../../../../model/events/application-events";
import Spinner from "@salesforce/design-system-react/module/components/spinner";
import Icon from "@salesforce/design-system-react/module/components/icon";

import {Settings, UserService} from "../../../../../../../../../model/services/core/UserService";
import {CustomEvents} from "../../../../../../../../../model/services/utility/EventsService";

class ProfileImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            picture: null,
            error: ""
        };
    }

    componentDidMount() {
        const {user} = this.props;
        this.setState({picture: UserService.composeUserPictureUrl(user)});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.reset && this.props.reset) {
            this.setState({loading: false, error: ""});
        }
    }

    handleLoadImage = event => {
        const mediaFile = event.target.files[0], fileSize = mediaFile.size / 1024 / 1024, fileSizeLimit = 1;
        if (fileSize > fileSizeLimit) {
            this.setState({error: `Profile picture exceed file size limit: maximum ${fileSizeLimit}MB.`});
        } else {
            this.handlePreLoadImage(mediaFile);
            this.setState({loading: true, error: ""}, _ => {
                CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: true}})
                    .then(_ => {
                        const FD = new FormData();
                        FD.append("file", mediaFile);
                        return Settings.changePicture(FD);
                    })
                    .then(_ => this.setState({loading: false}))
                    .then(_ => CustomEvents.fire({eventName: Events.USER.RELOAD}))
                    .then(_ => CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: false}}));
            });
        }
    };

    handlePreLoadImage = mediaFile => {
        const reader = new FileReader();
        reader.onload = _ => {
            this._avatarImg.src = reader.result;
        };
        reader.readAsDataURL(mediaFile);
    };

    render() {
        const {user} = this.props, {loading, picture, error} = this.state;
        return (
            <div className="slds-p-horizontal--small">
                <div className="slds-text-align_center">
                    <span className="slds-avatar slds-avatar_large" style={{width: "10rem", height: "10rem"}}>
                        <img src={picture} ref={el => this._avatarImg = el} alt={user.name}/>
                    </span>
                </div>
                <div className="slds-form-element slds-m-top_small">
                    <div className="slds-form-element__label">Profile photo</div>
                    <div className="slds-form-element__control">
                        <div className="slds-file-selector slds-file-selector_files">
                            <div className="slds-file-selector__dropzone">
                                <input type="file" disabled={loading} accept={"image/*"}
                                       ref={el => this._fileInput = el}
                                       onChange={this.handleLoadImage}
                                       className="slds-file-selector__input slds-assistive-text"/>
                                <label className="slds-file-selector__body" onClick={_ => this._fileInput.click()}>
                                    <span className="slds-file-selector__button slds-button slds-button_neutral">
                                        <Icon category="utility" name="upload" size="x-small"/>&nbsp;Upload Files</span>
                                    <span className="slds-file-selector__text slds-medium-show">or Drop Files</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="slds-form-element__help">
                        {!loading && !!error && <span className="slds-text-color_error">{error}</span>}
                        {loading && <div className="slds-float_left slds-is-relative slds-p-vertical--medium slds-p-left_large">
                            <Spinner variant="brand" size="small"/>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileImage;