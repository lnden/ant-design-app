import React,{createElement} from 'react'
import Loadable from 'react-loadable';
import {Button,Spin} from 'antd'

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
                return props =>
                    createElement(Component, {
                        ...props,
                        routerData: routerDataCache,
                    });
            });
        },
        loading: LoadingComponent,
    });
};

export const getRouterData = (app) => [
    {
        layout: 'BasicLayout',
        component: dynamicWrapper(app,['app'],()=>import('../layouts/BasicLayout')),
        children: [
            {
                path:'/',
                children: [
                    {
                        path:'workspace',
                        name:'工作台',
                        icon: 'desktop',
                        component :dynamicWrapper(app,['workspace'],()=>import('../containers/Workspace')),
                    }
                ]
            }
        ]
    },
    {
        layout: 'UserLayout',
        component: dynamicWrapper(app,[],()=>import('../layouts/UserLayout')),
        children :[
            {
                path: 'user',
                children: [
                    {
                        path: 'login',
                        name: '登录',
                        component: dynamicWrapper(
                            app,
                            ['login'],
                            ()=>import('../containers/User/Login')
                        )
                    },
                    {
                        path: 'register',
                        name: '注册',
                        component: dynamicWrapper(
                            app,
                            ['register'],
                            ()=>import('../containers/User/Register')
                        )
                    },
                    {
                        path: 'resetPassword',
                        name: '重置密码',
                        component: dynamicWrapper(
                            app,
                            ['resetPassword'],
                            ()=>import('../containers/User/ResetPassword')
                        )
                    }
                ]
            }
        ]
    }
];
