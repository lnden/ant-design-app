import { routerRedux } from 'dva/router';
import config from '../config/app.config';
import { createAction } from '../utils';
import { setCache } from '../utils/cookies';
import { getProfile } from '../services/userRequest';

const defaultState = {
    profile: {},
};

export default {
    namespace: 'accountSetting',
    state: defaultState,
    subscriptions: {},
    reducers: {
        updateProfile(state, action) {
            return {
                ...state,
                profile: action.payload,
            };
        },
    },
    effects: {
        *getProfile(_, { call, put }) {
            let profile = null;
            try {
                profile = yield call(getProfile);
            } catch {
                yield put(routerRedux.replace('/user/login'));
                return;
            }

            if (!profile) return;

            yield put(createAction('updateProfile')(profile));
            yield call(setCache, {
                key: config.localCacheAlias.profile,
                value: profile,
                type: 2,
            });
        },
    },
};
