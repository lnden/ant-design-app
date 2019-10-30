/**
 * 判断是否数组
 *
 * @name isArray
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否数组
 */
export const isArray = o => {
    return (
        (o || false) &&
        (o.constructor === Array || Object.prototype.toString.call(o) === '[object Array]')
    );
};

/**
 * 判断是Promise对象
 *
 * @name isPromise
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否数组
 */
export const isPromise = obj => {
    return (
        !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function'
    );
};

/**
 * 判断是否Object
 *
 * @name isObject
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否Object
 */
export const isObject = o => {
    return (
        (o || false) &&
        (o.constructor === Object || Object.prototype.toString.call(o) === '[object Object]')
    );
};

/**
 * 判断是否布尔类型
 *
 * @name isBoolean
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否布尔类型
 */
export const isBoolean = o => {
    return (o === false || o || false) && o.constructor === Boolean;
};

/**
 * 判断是否数值类型
 *
 * @name isNumber
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否数值类型
 */
export const isNumber = o => {
    return (o === 0 || o || false) && o.constructor === Number;
};

/**
 * 判断是否undefined
 *
 * @name isUndefined
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否undefined
 */
export const isUndefined = o => {
    return typeof o === 'undefined';
};

/**
 * 判断是否Null
 *
 * @name isNull
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否Null
 */
export const isNull = o => {
    return o === null;
};

/**
 * 判断是否function
 *
 * @name isFunction
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否function
 */
export const isFunction = o => {
    return (o || false) && o.constructor === Function;
};

/**
 * 判断是否字符串
 *
 * @name isString
 * @function
 * @memberOf Verify
 * @param {Object} o 判断对象
 * @return {boolean} 是否字符串
 */
export const isString = o => {
    return (o === '' || o || false) && o.constructor === String;
};

/**
 * Check whether the o is Chinese
 *
 * @name isChinese
 * @function
 * @memberOf Verify
 * @param {object} o
 * @return {boolean} 是否是汉字
 */
export const isChinese = o => {
    return /^[\u4e00-\u9fa5]+$/.test(o);
};

/**
 * Check whether the o is Email
 *
 * @name isEmail
 * @function
 * @memberOf Verify
 * @param {object} o
 * @return {boolean} 是否是邮箱
 */
export const isEmail = o => {
    return /^[\w-_]+@[\w-_]+(?:\.\w+)+$/.test(o);
};

/**
 * Check whether the o is Email
 *
 * @name isIDCard
 * @function
 * @memberOf Verify
 * @param {object} o
 * @return {boolean} 身份证号是否正确
 */
export const isIDCard = o => {
    return /(?:^\d{15}$)|(?:^\d{17}(?:[0-9]|X|x)$)/.test(o);
};

/**
 * Check whether the o is phone
 *
 * @name isPhone
 * @function
 * @memberOf Verify
 * @param {object} o
 * @return {boolean}
 */
export const isPhone = o => {
    return /^1\d{10}$/.test(o);
};
