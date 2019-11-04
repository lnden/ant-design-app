import { routerRedux } from 'dva/router';
import { getCache } from '../utils/cookies';
import { delay } from '../utils/utils';
import config from '../config/app.config';

export default {
    namespace: 'global',
    state: {
        basicLayoutRouteList: [],
        collapsed: false,
    },
    subscriptions: {},
    reducers: {
        updateRouteList(state, action) {
            return {
                ...state,
                basicLayoutRouteList: action.payload,
            };
        },
        changeLayoutCollapsed(state, action) {
            return {
                ...state,
                collapsed: action.payload,
            };
        },
    },
    effects: {
        *basicLayoutInit({ payload }, { call, put }) {
            yield put({
                type: 'updateRouteList',
                payload,
            });
            const token = yield call(getCache, {
                key: config.localCacheAlias.token,
                type: 2,
            });
            if (token) {
                yield call(delay, 50);
                yield put(routerRedux.replace('/user/login'));
                return;
            }
            yield put({
                type: 'accountSetting/getProfile',
            });
            yield put({
                type: 'menu/getAuthMenuList',
                payload,
            });
            yield put({
                type: 'sysMsg/getNotifyCount',
            });
        },
    },
};
