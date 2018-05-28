/* eslint no-nested-ternary: "off" */

export default (value = false) => value === 'false' ? false : value === 'true' ? true : !!value;
