import { EMAIL_REGEX } from "./constants";

const isRequired = fieldName => value => {
    if (!value) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    }
};

const minLength = min => fieldName => value => {
    if (value.length < min) {
        return `Min ${fieldName} length is ${min}`;
    }
};

const isEmail = value => {
    if (!EMAIL_REGEX.test(value)) {
        return "Invalid email";
    }
};

export {
    isRequired,
    minLength,
    isEmail
};