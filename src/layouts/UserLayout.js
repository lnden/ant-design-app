import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'dva/router';
import GlobalFooter from '../components/GlobalFooter';
import style from './userLayout.module.less';

import { getRouteData } from '../utils/utils';

const copyright = <>© 2019 北京xxx科技有限公司</>;

class UserLayout extends Component {
    constructor(props) {
        super(props);
        this.routeList = getRouteData(props.routerData, 'UserLayout');
    }

    render() {
        return (
            <div>
                <div className={style.content}>
                    <div className={style.top}>
                        <div className={style.header}>
                            <img
                                alt="logo"
                                className={style.logo}
                                src="//www.baidu.com/img/bd_logo1.png?qua=high&where=super"
                            />
                        </div>
                        <div className={style.title}>百度管理系统</div>
                    </div>
                    <Switch>
                        {this.routeList.map(item => (
                            <Route
                                key={item.key || item.path}
                                path={item.path}
                                component={item.component}
                                exact={item.exact}
                            />
                        ))}
                        <Redirect from="/user" to="/user/login" />
                    </Switch>
                </div>
                <GlobalFooter copyright={copyright} />
            </div>
        );
    }
}

export default UserLayout;
