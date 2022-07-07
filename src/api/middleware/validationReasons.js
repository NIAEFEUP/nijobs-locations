const ValidationReasons = Object.freeze({
    DEFAULT: "invalid",
    REQUIRED: "required",
    UNKNOWN: "unexpected-error",
    STRING: "must-be-string",
    TOO_SHORT: (len) => `below-min-length:${len}`,
});

export default ValidationReasons;
