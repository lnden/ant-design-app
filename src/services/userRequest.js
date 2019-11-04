import request from '../utils/request';

export function getProfile() {
    return request(`/mocks/profile.json`).then(res => res?.data || res);
}
