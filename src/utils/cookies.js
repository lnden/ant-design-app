import { cookiesExpireTime } from './time';
import { isObject, isArray } from './verify';

const data2stringify = value => {
    if (isObject(value) || isArray(value)) {
        return JSON.stringify(value);
    }
    return value;
};

const data2json = value => {
    let newValue = null;
    try {
        newValue = JSON.parse(value);
    } catch (err) {
        newValue = value;
    }
    return newValue;
};

/**
 * getCookie
 * @param {String} sKey
 * @returns {String}
 */
export const getCookies = sKey => {
    if (!sKey) {
        return null;
    }
    return (
        decodeURIComponent(
            document.cookie.replace(
                new RegExp(
                    `(?:(?:^|.*;)\\s*${encodeURIComponent(sKey).replace(
                        /[-.+*]/g,
                        '\\$&',
                    )}\\s*\\=\\s*([^;]*).*$)|^.*$`,
                ),
                '$1',
            ),
        ) || null
    );
};

/**
 * setCookies
 * @param {String} sKey
 * @param {String} sValue
 * @param {String} vEnd
 * @param {String} sPath
 * @param {String} sDomain
 * @param {String} bSecure
 * @returns {Boolean}
 */
export const setCookies = (sKey, sValue, vEnd, sPath, sDomain, bSecure) => {
    let sExpires = '';
    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
        return false;
    }
    if (vEnd) {
        switch (vEnd.constructor) {
            case Number:
                sExpires =
                    vEnd === Infinity ? 'expires=Fri, 31 Dec 9999 23:59:59 GMT' : `max-age=${vEnd}`;
                break;
            case String:
                sExpires = `expires=${vEnd}`;
                break;
            case Date:
                sExpires = `expires=${vEnd}`;
                break;
            default:
        }
    }
    const encodeSKey = encodeURIComponent(sKey);
    const encodeSValue = encodeURIComponent(sValue);
    document.cookie = `${encodeSKey}=${encodeSValue};${sExpires};${(sDomain &&
        `domain=${sDomain}`) ||
        ''};${(sPath && `path=${sPath}`) || ''};${(bSecure && `secure=${bSecure}`) || ''}`;
    return true;
};

/**
 * removeCookies
 * @param {String} sKey
 * @param {String} sPath
 * @param {String} sDomain
 * @returns {Boolean}
 */
export const removeCookies = (sKey, sPath, sDomain) => {
    const encodeSKey = encodeURIComponent(sKey);
    document.cookie = `${encodeSKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;${(sDomain &&
        `domain=${sDomain}`) ||
        ''};${(sPath && `path=${sPath}`) || ''}`;
    return true;
};

/**
 * @name 是否支持localStorage
 * @returns [true/false]
 */
const isStorageSupported = () => {
    let supported = false;
    if (localStorage && localStorage.setItem) {
        supported = true;
        const key = `__${Math.round(Math.random() * 1e7)}`;
        try {
            localStorage.setItem(key, key);
            localStorage.removeItem(key);
        } catch (err) {
            supported = false;
        }
    }
    return supported;
};

/**
 * @name 是否支持sessionStoreage
 * @return [true/false]
 */
const isSessionStorageSupported = () => {
    let supported = false;
    if (sessionStorage && sessionStorage.setItem) {
        supported = true;
        const key = `__${Math.round(Math.random() * 1e7)}`;
        try {
            sessionStorage.setItem(key, key);
            sessionStorage.removeItem(key);
        } catch (err) {
            supported = false;
        }
    }
    return supported;
};

/**
 * @name 设置缓存
 * @type :
 *      1.localStorage
 *      2.sessionStorage
 *      3.cookies
 */

export const setCache = ({ key, value, time, type = 3 }) => {
    const newValue = data2stringify(value);
    if (type === 1 && isStorageSupported()) {
        localStorage.setItem(key, newValue);
        return;
    } else if (type === 2 && isSessionStorageSupported()) {
        sessionStorage.setItem(key, newValue);
        return;
    }
    setCookies(key, newValue, cookiesExpireTime(time));
};

export const getCache = ({ key, type = 3 }) => {
    let value = null;
    if (type === 1 && isStorageSupported()) {
        value = localStorage.getItem(key);
    } else if (type === 2 && isSessionStorageSupported()) {
        value = sessionStorage.getItem(key);
    } else {
        value = getCookies(key);
    }
    value = data2json(value);
    return value;
};

export const removeCache = ({ key, type = 3 }) => {
    if (type === 1 && isStorageSupported()) {
        localStorage.removeItem(key);
    } else if (type === 2 && isSessionStorageSupported()) {
        sessionStorage.removeItem(key);
    } else {
        removeCookies(key);
    }
};
