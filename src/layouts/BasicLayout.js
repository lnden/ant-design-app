import React, { Component } from 'react';
import { connect } from 'dva';
import { Redirect, Switch, Route, routerRedux } from 'dva/router';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import { createAction } from '../utils';
import { getRouteData, emptyArray } from '../utils/utils';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import logo from '../assets/logo.png';

const { Content, Header, Footer } = Layout;
/**
 * 获取面包屑映射
 * @param {Array} routerList 路由配置
 */
const getBreadcrumbNameMap = routerList => {
    // 内部多写一层，是为了 memoizeOne
    const computedWholeRouteUrl = (list, parentPath = '') => {
        const result = {};
        const childResult = {};
        for (let i = 0; i < list.length; i += 1) {
            const item = list[i];
            const path = `${parentPath}/${item.path}`.replace(/\/+/g, '/');
            result[path] = item;
            if (item.children) {
                /* eslint-disable*/
                Object.assign(childResult, computedWholeRouteUrl(item.children, path));
            }
        }
        return { ...list, ...result, ...childResult };
    };
    return computedWholeRouteUrl(routerList);
};

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};

class BasicLayout extends Component {
    static propTypes = {
        collapsed: PropTypes.bool.isRequired,
        authMenuList: PropTypes.array.isRequired,
    };

    routeList = [];

    routeComponentList = [];

    constructor(props) {
        super(props);
        this.routeList = getRouteData(props.routerData, 'BasicLayout');
        this.renderRouteComponentList();
        const { dispatch } = props;
        dispatch(createAction('global/basicLayoutInit')({ routeList: this.routeList }));
    }

    renderRouteComponentList = () => {
        this.routeComponentList = this.routeList.map(item => (
            <Route
                key={item.path}
                path={item.path}
                render={props => {
                    const ItemComponent = item.component;
                    return <ItemComponent {...props} routeList={item.children || emptyArray} />;
                }}
                exact={item.exact}
            />
        ));
    };

    handleMenuCollapse = collapsed => {
        const { dispatch } = this.props;
        dispatch(createAction('global/changeLayoutCollapsed')(collapsed));
    };

    matchParamsPath = pathname => {
        const breadcrumbNameMap = getBreadcrumbNameMap(this.routeList);
        const pathKey = Object.keys(breadcrumbNameMap).find(key =>
            pathToRegexp(key).test(pathname),
        );
        return breadcrumbNameMap[pathKey];
    };

    getPageTitle = () => {
        const { location } = this.props;
        const { pathname } = location;
        let title = 'React';
        const currRouterData = this.matchParamsPath(pathname);
        if (currRouterData) {
            title = currRouterData.name;
        }
        return `${title} - 管理系统`;
    };

    handleMenuClick = ({ key }) => {
        const { dispatch } = this.props;
        if (key === 'logout') {
            dispatch(createAction('login/logout')());
        }
        if (key === 'accountSetting') {
            dispatch(routerRedux.push('/accountSetting'));
        }
    };

    renderLayout = params => {
        const { collapsed, authMenuList } = this.props;
        const layout = (
            <Layout>
                <SiderMenu
                    logo={logo}
                    location={location}
                    collapsed={collapsed}
                    menuData={(authMenuList && authMenuList[0]?.children) || emptyArray}
                />
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <GlobalHeader
                            collapsed={collapsed}
                            onCollapse={this.handleMenuCollapse}
                            onMenuClick={this.handleMenuClick}
                        />
                    </Header>
                    <Content>
                        <Switch>
                            {this.routeComponentList}
                            <Redirect from="/user" to="/user/login" />
                        </Switch>
                    </Content>
                    <Footer>
                        <GlobalFooter
                            copyright={
                                <>
                                    © 2019 北京xxxx科技有限公司
                                    {collapsed ? 'true' : 'false'}
                                </>
                            }
                        />
                    </Footer>
                </Layout>
            </Layout>
        );
        return <div className={classNames(params)}>{layout}</div>;
    };

    render() {
        return (
            <DocumentTitle title={this.getPageTitle()}>
                <ContainerQuery query={query}>{this.renderLayout}</ContainerQuery>
            </DocumentTitle>
        );
    }
}

const mapStateToProps = state => {
    return {
        collapsed: state.global.collapsed,
        authMenuList: state.menu.authMenuList,
    };
};

export default connect(mapStateToProps)(BasicLayout);
