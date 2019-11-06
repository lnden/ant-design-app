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
