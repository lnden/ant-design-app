import { isString, isArray } from './verify';

/**
 * 创建标准的action
 * 柯里化
 * @param type
 * @return {function(*): {type: *, payload: *}}
 */
export const createAction = type => payload => ({
    type,
    payload,
});

/**
 * 逐级从state中取值
 * @param {array} props
 * @return {function(*=): *}
 */
const getValueFormState = props => state => props.reduce((parent, child) => parent[child], state);

/**
 * 从state中获取loading
 * @param {string} type
 * @return {function(*=): boolean}
 */
const getLoadingFormState = type => {
    return state => {
        return !!state.loading.effects[type];
    };
};

/**
 * 保证全局loading对象发生变化时，不会引发所有页面的更新
 * 只关心某个副作用下的loading变化
 * eg:
 *      ('type')   ->   state => !!state.loading.effects['type']
 *      (['type1', 'type2'])  ->  [state => !!state.loading.effects['type1'], state => !!state.loading.effects['type2']]
 *
 * @param {string|array} types
 * @return {function(*): boolean}
 */
export const loadingSelector = types => {
    if (isString(types)) {
        return getLoadingFormState(types);
    }
    if (isArray(types)) {
        return types.map(item => getLoadingFormState(item));
    }
    throw new Error('传入的参数错误');
};

/**
 * 从state上取出属性
 * eg:
 *      ('someKey')  ->  state => state.someKey
 *      ('parentKey', 'someKey') ->  state => state.parentKey.someKey
 *      ('parentKey1', 'parentKey2', 'someKey') ->  state => state.parentKey1.parentKey2.someKey
 *      ('parentKey', ['someKey1', 'someKey2']) ->  [state => state.parentKey.someKey1, state => state.parentKey.someKey2]
 *
 * @param {string|array} props
 * @return {function(*): *}
 */
export const selector = (...props) => {
    const trailProps = props[props.length - 1];
    if (isString(trailProps)) {
        return getValueFormState(props);
    }
    if (isArray(trailProps)) {
        const parentProps = props.slice(0, -1);
        return trailProps.map(trailProp => getValueFormState(parentProps.concat(trailProp)));
    }
    throw new Error('传入的参数错误');
};
