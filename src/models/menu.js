import { createAction } from '../utils';
import { computeMenu, getMenuTree } from '../utils/utils';
import { getAuthMenuList } from '../services/menuRequest';

const defaultState = {
    menuList: [],
    authMenuList: [],
};

export default {
    namespace: 'menu',
    state: defaultState,
    subscriptions: {},
    reducers: {
        updateAuthMenuList(state, action) {
            return {
                ...state,
                authMenuList: getMenuTree(action.payload),
            };
        },
    },
    effects: {
        *getAuthMenuList({ payload }, { call, put, select }) {
            let routeList = payload;
            if (!routeList) {
                routeList = yield select(state => state.global.basicLayoutRouteList);
            }
            const authMennuList = yield call(getAuthMenuList);
            if (!authMennuList) {
                return;
            }
            const newAuthMenuList = computeMenu(authMennuList.data, routeList);
            // reloadAuthorized();
            yield put(createAction('updateAuthMenuList')(newAuthMenuList));
        },
    },
};
