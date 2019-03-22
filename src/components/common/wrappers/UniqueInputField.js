import InputField from "./InputField";

class UniqueInputField extends InputField {
    constructor(value = "", {fieldName, pattern}) {
        super(value, {fieldName: fieldName, pattern: pattern});
        this._unique = false;
    }

    get unique() {
        return this._unique;
    }

    set unique(value) {
        this._unique = value;
    }
}

export default UniqueInputField;