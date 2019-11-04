import { getUnreadCount } from '../services/sysMsgRequest';

const defaultState = {
    detail: {},
};

export default {
    namespace: 'sysMsg',
    state: defaultState,
    subscriptions: {},
    reducers: {},
    effects: {
        *getNotifyCount(_, { call, put }) {
            const count = yield call(getUnreadCount);
            yield put({
                type: 'updateNotifyCount',
                payload: count,
            });
        },
    },
};
