export default (url = '') => url.includes('?') ? url.substr(0, url.indexOf('?')) : url;
