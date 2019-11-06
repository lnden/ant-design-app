import { routerRedux } from 'dva/router';
import config from '../config/app.config';
import { createAction } from '../utils';
import { delay } from '../utils/utils';
import { getCache } from '../utils/cookies';

export default {
    namespace: 'global',
    state: {
        basicLayoutRouteList: [],
        collapsed: false,
    },
    subscriptions: {},
    reducers: {
        updateRouteList(state, { payload }) {
            return {
                ...state,
                basicLayoutRouteList: payload,
            };
        },
        changeLayoutCollapsed(state, { payload }) {
            return {
                ...state,
                collapsed: payload,
            };
        },
    },
    effects: {
        *basicLayoutInit({ payload }, { call, put }) {
            const { routeList } = payload;
            yield put(createAction('updateRouteList')(routeList));
            const token = yield call(getCache, {
                key: config.localCacheAlias.token,
                type: 2,
            });
            if (token) {
                yield call(delay, 50);
                yield put(routerRedux.replace('/user/login'));
                return;
            }
            yield put(createAction('accountSetting/getProfile')());
            yield put(createAction('menu/getAuthMenuList')(routeList));
            yield put(createAction('sysMsg/getNotifyCount')());
        },
    },
};
