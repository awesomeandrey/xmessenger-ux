import React from "react";
import Events from "../../../../../model/HomePageEvents";
import FieldDefinition from "../../../../../../../common/model/FieldDefinition";

import {Settings, UserService} from "../../../../../../../../model/services/core/UserService";
import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";
import {InputPatterns, Utility} from "../../../../../../../../model/services/utility/UtilityService";
import {Button, Icon, Input, Spinner} from "react-lightning-design-system";

class ProfileSettings extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handlePreLoadPicture = this.handlePreLoadPicture.bind(this);
        this.state = {
            loading: false,
            notification: Object.create(null),
            inputs: {
                name: Object.create(null),
                picture: Object.create(null)
            },
            selectedPicture: null
        };
    }

    componentDidMount() {
        // Instantiate field entities;
        const {user} = this.props, inputFields = Object.create(null);
        [
            new FieldDefinition(user.name, {fieldName: "name", pattern: InputPatterns.NAME}),
            new FieldDefinition({}, {fieldName: "picture"})
        ].forEach(inputField => {
            Object.defineProperty(inputFields, inputField.name, {
                value: inputField, writable: true
            });
        });
        this.setState({
            inputs: inputFields,
            selectedPicture: UserService.composeUserPictureUrl(user)
        });
    }

    handlePreLoadPicture(event) {
        const {inputs} = this.state, pictureField = inputs.picture;
        const mediaFile = event.target.files[0],
            fileSize = mediaFile.size / 1024 / 1024,
            fileSizeLimit = 5;
        if (fileSize > fileSizeLimit) {
            pictureField.error = `Profile picture exceed file size limit: maximum ${fileSizeLimit}MB.`;
        } else {
            pictureField.error = "";
            let reader = new FileReader();
            reader.onload = _ => {
                this._avatarImg.src = reader.result;
            };
            reader.readAsDataURL(mediaFile);
        }
        this.handleChangeInput(pictureField, mediaFile);
    }

    handleChangeInput(inputField, value) {
        const {inputs} = this.state, propName = inputField.name;
        if (!!inputs[propName]) {
            inputField.inputValue = value;
            Object.defineProperty(inputs, propName, {
                value: inputField
            });
            this.setState({inputs: inputs});
        }
    }

    handleSubmitForm() {
        this.setState({loading: true});
        if (this.isFormFulfilled()) {
            let {inputs} = this.state, promisesToExecute = [];
            [
                {
                    field: inputs.picture,
                    promise: _ => {
                        let FD = new FormData();
                        FD.append('file', inputs.picture.value);
                        return Settings.changePicture(FD);
                    }
                },
                {
                    field: inputs.name, promise: _ => {
                        let {user} = this.props;
                        const userToUpdate = {
                            id: user.id,
                            name: inputs.name.value,
                        };
                        return Settings.changeProfileInfo(userToUpdate);
                    }
                }
            ].forEach(item => {
                if (item.field.changed) {
                    promisesToExecute.push(item.promise()); // return Promise to be executed;
                }
            });
            if (promisesToExecute.length === 0) {
                this.setState({
                    loading: false,
                    notification: {type: "error", message: "Nothing was changed on the profile form."}
                });
            } else {
                CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: true}});
                Promise.all(promisesToExecute)
                    .then(_ => CustomEvents.fire({eventName: Events.USER.RELOAD}))
                    .then(_ => {
                        Object.getOwnPropertyNames(inputs).forEach(propName => {
                            inputs[propName].changed = false;
                        });
                        return inputs;
                    })
                    .then(inputs => this.setState({
                        inputs: inputs,
                        loading: false,
                        notification: {type: "success", message: "Done!"}
                    }))
                    .then(CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: false}}));
            }
        } else {
            this.setState({
                loading: false,
                notification: {type: "error", message: "All fields should be populated correctly."}
            });
        }
    }

    isFormFulfilled() {
        let allInputsMatchPattern = true, {inputs} = this.state;
        Object.getOwnPropertyNames(inputs).forEach(propName => {
            let inputField = inputs[propName];
            if (inputField.changed && !inputField.matchesPattern()) {
                allInputsMatchPattern = false;
            }
        });
        return allInputsMatchPattern;
    }

    render() {
        const {user} = this.props, {loading, notification, inputs, selectedPicture} = this.state;
        return (
            <div className="slds-grid slds-wrap slds-gutters">
                <div className="slds-col slds-size_1-of-1 slds-medium-size_5-of-12 slds-large-size_6-of-12">
                    <div className="slds-text-align_center">
                        <span className="settings-profile-picture">
                            <img src={selectedPicture} ref={el => this._avatarImg = el} alt={user.name}/>
                        </span>
                    </div>
                    <div className="slds-form-element slds-has-error slds-m-top_small">
                        <div className="slds-form-element__label">Profile photo</div>
                        <div className="slds-form-element__control slds-text-align_center">
                            <div className={`slds-file-selector slds-file-selector_files
                                ${loading ? `slds-hide` : `slds-show`}`}>
                                <div className="slds-file-selector__dropzone">
                                    <input type="file" disabled={loading} accept={"image/*"}
                                           ref={el => this._fileInput = el}
                                           onChange={this.handlePreLoadPicture}
                                           className="slds-file-selector__input slds-assistive-text"/>
                                    <label className="slds-file-selector__body" onClick={_ => this._fileInput.click()}>
                                        <span className="slds-file-selector__button slds-button slds-button_neutral">
                                            <Icon icon="utility:upload" size="x-small"/>&nbsp;Upload Files
                                        </span>
                                        <span className="slds-file-selector__text slds-medium-show">or Drop Files</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="slds-form-element__help">
                            <span className={`${loading ? 'slds-hide' : 'slds-show'}`}>
                                {inputs.picture.error}</span>
                        </div>
                    </div>
                </div>
                <div className="slds-col slds-size_1-of-1 slds-medium-size_7-of-12 slds-large-size_6-of-12">
                    <div className="slds-form--stacked">
                        <Input label="Name" iconRight="user" disabled={loading}
                               value={inputs.name.value}
                               onChange={e => this.handleChangeInput(inputs.name, e.target.value)}
                               error={inputs.name.error}
                               placeholder="Enter your name" required/>
                        <Input label="Username" value={Utility.decorateUsername(user.username)}
                               iconRight="fallback" readOnly/>
                        <div className={`slds-p-top_x-small ${loading ? 'slds-hide' : 'slds-show'}`}>
                            {!!notification &&
                            <div className={`slds-text-color_${notification.type}`}>{notification.message}</div>}
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="slds-col">
                    {loading
                        ? (<div className="slds-is-relative slds-p-around_medium slds-float_left">
                            <Spinner type="brand" container={false}/>
                        </div>)
                        : (<Button className="slds-float_right" type="brand"
                                   onClick={this.handleSubmitForm}>Submit</Button>)}
                </div>
            </div>
        );
    }
}

export default ProfileSettings;