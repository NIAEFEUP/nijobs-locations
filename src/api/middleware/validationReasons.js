const ValidationReasons = Object.freeze({
    DEFAULT: "invalid",
    UNKNOWN: "unexpected-error",
    TOO_SHORT: (len) => `below-min-length:${len}`,
});

export default ValidationReasons;
