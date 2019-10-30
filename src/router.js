import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './config/router.config';

const { ConnectedRouter } = routerRedux;

function getLayout(navData, layoutName) {
    if (
        !navData.some(item => item.layout === layoutName) ||
        !navData.filter(item => item.layout === layoutName)[0].children
    ) {
        return null;
    }
    const layout = navData.filter(item => item.layout === layoutName)[0];
    return {
        component: layout.component,
        layout: layout.layout,
        name: layout.name,
        path: layout.path,
    };
}

function RouterConfig({ history, app }) {
    const routerData = getRouterData(app);
    const UserLayout = getLayout(routerData, 'UserLayout').component;
    const BasicLayout = getLayout(routerData, 'BasicLayout').component;
    return (
        <ConfigProvider locale={zhCN}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route path="/user" component={UserLayout} />
                    <Route path="/" component={BasicLayout} />
                </Switch>
            </ConnectedRouter>
        </ConfigProvider>
    );
}

export default RouterConfig;
