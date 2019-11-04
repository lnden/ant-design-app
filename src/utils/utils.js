import cloneDeep from 'lodash/cloneDeep';
import config from '../config/app.config';

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

/**
 * @name 数字转为大写
 * @param String
 * @return {string}
 */
export function digitUppercase(n) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    const head = n < 0 ? '欠' : '';
    // eslint-disable-next-line no-param-reassign
    n = Math.abs(n);

    let s = '';

    for (let i = 0; i < fraction.length; i += 1) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    // eslint-disable-next-line no-param-reassign
    n = Math.floor(n);

    for (let i = 0; i < unit[0].length && n > 0; i += 1) {
        let p = '';
        for (let j = 0; j < unit[1].length && n > 0; j += 1) {
            p = digit[n % 10] + unit[1][j] + p;
            // eslint-disable-next-line no-param-reassign
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return (
        head +
        s
            .replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整')
    );
}

export const emptyArray = Object.freeze([]);

let delayTimeout = null;
export const delay = (timeout = 1000) => {
    return new Promise(resolve => {
        delayTimeout = setTimeout(() => {
            if (delayTimeout) {
                clearTimeout(delayTimeout);
                delayTimeout = null;
            }
            resolve();
        }, timeout);
    });
};

export const getMenuTree = (menuList, parentId = config.rootParentId) => {
    const menuChildren = menuList.filter(item => item.parentId === parentId);
    if (!menuChildren.length) {
        return null;
    }
    return menuChildren.map(item => ({
        ...item,
        children: getMenuTree(menuList, item.id),
    }));
};

export const getRouteByAccessKey = (routeList, accessKey, parentPath = '') => {
    for (let i = 0; i < routeList.length; i += 1) {
        const route = routeList[i];
        if (route?.accessKey === accessKey) {
            return {
                ...route,
                path: `${parentPath}/${route.path || ''}`.replace(/\/+/g, '/'),
            };
        }
        if (route.children) {
            const newPath = `${parentPath}/${route.path || ''}`.replace(/\/+/g, '/');
            const result = getRouteByAccessKey(route.children, accessKey, newPath);
            if (result) return result;
        }
    }
};

export const computeMenu = (menuList, routeList, isFilterInvalidMenu = true) => {
    return menuList
        .map(item => {
            const route = getRouteByAccessKey(routeList, item.accessKey);
            if (isFilterInvalidMenu && !route && item.parentId !== config.rootParentId) {
                return null;
            }
            return {
                ...item,
                path: route?.path || '/',
                name: item.name || route?.name || '',
                icon: item.icon || route?.icon || null,
            };
        })
        .filter(item => item);
};
