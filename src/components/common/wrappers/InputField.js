import {Utility} from "../../../model/services/utility/UtilityService";

class InputField {
    constructor(value = "", {fieldName, pattern}) {
        this._inputValue = value;
        this._fieldName = fieldName;
        this._pattern = pattern;
        this._errorMessage = "";
        this._changed = false;
    }

    get fieldName() {
        return this._fieldName;
    }

    set fieldName(value) {
        this._fieldName = value;
    }

    get inputValue() {
        return this._inputValue;
    }

    set inputValue(value) {
        this._inputValue = value;
        this._changed = true;
        if (!!this._pattern) {
            this.errorMessage = this.matchesPattern() ? "" : this.pattern.errorMessage;
        }
    }

    get pattern() {
        return this._pattern;
    }

    set pattern(value) {
        this._pattern = value;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    set errorMessage(value) {
        this._errorMessage = value;
    }

    get changed() {
        return this._changed;
    }

    set changed(value) {
        this._changed = value;
    }

    matchesPattern() {
        if (this._pattern === undefined) return true;
        return Utility.check(this._inputValue, this._pattern);
    }
}

export default InputField;