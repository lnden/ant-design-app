import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Switch, Route } from 'dva/router';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import { ContainerQuery } from 'react-container-query';
import { connect } from 'dva';
import { getRouteData, emptyArray } from '../utils/utils';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';

import logo from '../assets/logo.png';

const { Content, Header, Footer } = Layout;

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
        dispatch({
            type: 'global/basicLayoutInit',
            payload: this.routeList,
        });
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
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    getPageTitle = () => {
        const { location } = this.props;
        const { pathname } = location;
        let title = '极致驾服';
        this.routeList.forEach(item => {
            if (pathToRegexp(item.path).test(pathname)) {
                title = item.name || title;
            }
        });
        return title;
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
                        <GlobalHeader collapsed={collapsed} onCollapse={this.handleMenuCollapse} />
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
