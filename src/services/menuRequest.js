import request from '../utils/request';

export function getAuthMenuList() {
    return request(`/mocks/system/menu.json`).then(res => res?.data || res);
}
