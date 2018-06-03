/* eslint no-nested-ternary: "off" */
export default (url = '') => /data:.*;/.test(url) ? url.match(/data:.*;/).shift() : url.includes('?') ? url.substr(0, url.indexOf('?')) : url;
