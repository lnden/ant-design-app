import cloneDeep from 'lodash/cloneDeep';

const getPlainRoute = (routes, parentPath = '') => {
    const arr = [];
    routes.forEach(route => {
        const item = route;
        item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...getPlainRoute(item.children, item.path));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
};

export const getRouteData = (navData, layoutName) => {
    if (
        !navData.some(item => item.layout === layoutName) ||
        !navData.filter(item => item.layout === layoutName)[0].children
    ) {
        return null;
    }
    const route = cloneDeep(navData.filter(item => item.layout === layoutName)[0]);
    return getPlainRoute(route.children);
};
