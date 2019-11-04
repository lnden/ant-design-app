import request from '../utils/request';
import { isNumber } from '../utils/verify';

export function getUnreadCount() {
    return request(`/mocks/countNoRead.json`).then(res => {
        return isNumber(res?.data) ? res.data : res;
    });
}
