import React, { createElement } from 'react';
import Loadable from 'react-loadable';
import { Button, Spin } from 'antd';

const LoadingComponent = ({ error, timedOut, retry, pastDelay }) => {
    if (error) {
        console.error(error);
        // When the loader has errored
        return (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
                <div>
                    {(error && error.message) ||
                    (typeof error === 'string' && error) ||
                    '文件加载出错'}
                </div>
                <Button onClick={retry}>重试</Button>
            </div>
        );
    } else if (timedOut) {
        console.error(error);
        // When the loader has taken longer than the timeout
        return (
            <div>
                <div>超时</div>
                <Button onClick={retry}>重试</Button>
            </div>
        );
    } else if (pastDelay) {
        // When the loader has taken longer than the delay
        return <Spin size="large" className="global-spin"/>;
    }
    // When the loader has just started
    return null;
};

const modelNotExisted = (app, model) =>
    // eslint-disable-next-line
    !app._models.some(({ namespace }) => {
        return namespace === model.substring(model.lastIndexOf('/') + 1);
    });

let routerDataCache;

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
    // register models
    models.forEach(model => {
        if (modelNotExisted(app, model)) {
            // TODO 按需加载model
            // ref https://github.com/umijs/umi/blob/master/packages/umi/src/dynamic.js
            // ref https://github.com/jamiebuilds/react-loadable
            // app.model(model);
            app.model(require(`../models/${model}`).default);
        }
    });

    // () => import('module')
    return Loadable({
        loader: () => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return component().then(raw => {
                const Component = raw.default || raw;
                return props => {
                    return createElement(Component, {
                        ...props,
                        routerData: routerDataCache,
                    });
                };

            });
        },
        loading: LoadingComponent,
    });
};

export const getRouterData = (app) => [
    {
        layout: 'BasicLayout',
        component: dynamicWrapper(app, ['menu', 'accountSetting', 'sysMsg'], () => import('../layouts/BasicLayout')),
        children: [
            {
                path: '/',
                name: '首页',
                accessKey: 'version',
                children: [
                    {
                        path: 'workspace',
                        name: '工作台',
                        icon: 'desktop',
                        accessKey: 'workspace',
                        component: dynamicWrapper(app, ['workspace'], () => import('../containers/Workspace')),
                    },
                ],
            },
            {
                path: 'biz',
                name: '业务中心solution',
                icon: '',
                accessKey: 'biz',
                component: dynamicWrapper(app, [], () => import('../containers/Biz')),
                children: [
                    {
                        path: 'apply_accept',
                        name: '报名受理',
                        accessKey: 'apply_accept',
                        component: dynamicWrapper(app, [], () => import('../containers/Biz/ApplyAccept')),
                    },
                    {
                        path: 'teach',
                        name: '教研管理',
                        accessKey: 'teach',
                        component: dynamicWrapper(app, [], () => import('../containers/Biz')),
                        children: [
                            {
                                path: 'coach',
                                name: '教练管理',
                                accessKey: 'coach',
                                component: dynamicWrapper(app, [], () => import('../containers/Biz/Coach')),
                            },
                            {
                                path: 'course',
                                name: '课程管理',
                                accessKey: 'course',
                                component: dynamicWrapper(app, [], () => import( '../containers/Biz/CourseManage')),
                            },
                        ],
                    },
                    {
                        path: 'space',
                        name: '场地管理',
                        accessKey: 'space',
                        component: dynamicWrapper(app, [], () => import('../containers/Biz/Space')),
                    },
                ],

            },
            {
                path: 'system',
                name: '系统管理',
                icon: 'setting',
                accessKey: 'system',
                component: dynamicWrapper(app, [], () => import('../containers/System')),
                children: [
                    {
                        path: 'menu',
                        name: '菜单管理',
                        accessKey: 'menu',
                        component: dynamicWrapper(app, [], () => import('../containers/System/Menu')),
                    },
                    {
                        path: 'role',
                        name: '角色管理',
                        accessKey: 'role',
                        component: dynamicWrapper(app, [], () => import('../containers/System/Role')),
                    },
                    {
                        path: 'user',
                        name: '用户管理',
                        accessKey: 'user',
                        component: dynamicWrapper(app, [], () => import('../containers/System/User')),
                    },
                    {
                        path: 'sysMsg',
                        name: '系统消息',
                        accessKey: 'sysMsg',
                        component: dynamicWrapper(app, [], () => import('../containers/System/SysMsg')),
                    },
                    {
                        path: 'sysLog',
                        name: '系统日志',
                        accessKey: 'sysLog',
                        component: dynamicWrapper(app, [], () => import('../containers/System/SysLog')),
                    },
                ],
            },
            {
                path: 'feedback',
                name: '意见反馈',
                component: dynamicWrapper(app, [], () => import('../containers/Feedback')),
            },
            {
                path: 'accountSetting',
                name: '账号设置',
                component: dynamicWrapper(app, ['accountSetting'], () => import('../containers/AccountSetting')),
            },

        ],
    },
    {
        layout: 'UserLayout',
        component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
        children: [
            {
                path: 'user',
                children: [
                    {
                        path: 'login',
                        name: '登录',
                        component: dynamicWrapper(
                            app,
                            ['login'],
                            () => import('../containers/User/Login'),
                        ),
                    },
                    {
                        path: 'register',
                        name: '注册',
                        component: dynamicWrapper(
                            app,
                            ['register'],
                            () => import('../containers/User/Register'),
                        ),
                    },
                    {
                        path: 'resetPassword',
                        name: '重置密码',
                        component: dynamicWrapper(
                            app,
                            ['resetPassword'],
                            () => import('../containers/User/ResetPassword'),
                        ),
                    },
                ],
            },
        ],
    },
];
