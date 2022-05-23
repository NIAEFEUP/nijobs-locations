const ValidationReasons = Object.freeze({
    DEFAULT: "invalid",
    TOO_SHORT: (len) => `below-min-length:${len}`,
});

export default ValidationReasons;
