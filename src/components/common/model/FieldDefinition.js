import {Utility} from "../../../model/services/utility/UtilityService";

class FieldDefinition {
    constructor(value = "", {name, pattern}) {
        this._name = name;
        this._value = value;
        this._pattern = pattern;
        this._error = "";
        this._changed = false;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this._changed = true;
        if (!!this._pattern) {
            this._error = this.matchesPattern() ? "" : this.pattern.errorMessage;
        }
    }

    get pattern() {
        return this._pattern;
    }

    set pattern(value) {
        this._pattern = value;
    }

    get error() {
        return this._error;
    }

    set error(value) {
        this._changed = true;
        this._error = value;
    }

    get changed() {
        return this._changed;
    }

    set changed(value) {
        this._changed = value;
    }

    matchesPattern() {
        if (this._pattern === undefined) return true;
        return Utility.check(this._value, this._pattern);
    }
}

export default FieldDefinition;