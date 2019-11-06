import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import pathToRegexp from 'path-to-regexp';
import { getRouteData } from '../utils/utils';
import GlobalFooter from '../components/GlobalFooter';

import styles from './userLayout.module.less';

const copyright = <>© 2019 北京xxx科技有限公司</>;

class UserLayout extends Component {
    routeList = [];

    constructor(props) {
        super(props);
        this.routeList = getRouteData(props.routerData, 'UserLayout');
    }

    getPageTitle() {
        const { location } = this.props;
        const { pathname } = location;
        let title = '后台管理系统';
        this.routeList.forEach(item => {
            if (pathToRegexp(item.path).test(pathname)) {
                title = item.name || title;
            }
        });
        return title;
    }

    render() {
        return (
            <DocumentTitle title={this.getPageTitle()}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.top}>
                            <div className={styles.header}>
                                <img
                                    alt="logo"
                                    className={styles.logo}
                                    src="//www.baidu.com/img/bd_logo1.png?qua=high&where=super"
                                />
                            </div>
                            <div className={styles.title}>百度管理系统</div>
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
            </DocumentTitle>
        );
    }
}

export default UserLayout;
