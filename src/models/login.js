import { routerRedux } from 'dva/router';
import config from '../config/app.config';
import { removeCache } from '../utils/cookies';

export default {
    namespace: 'login',
    state: {},
    subscriptions: {},
    reducers: {},
    effects: {
        *logout(_, { call, put }) {
            yield call(removeCache, {
                key: config.localCacheAlias.token,
                type: 2,
            });
            yield put(routerRedux.replace('/user/login'));
        },
    },
};
