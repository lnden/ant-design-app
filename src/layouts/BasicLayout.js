import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Switch, Route } from 'dva/router';
import { Layout } from 'antd';
import { connect } from 'dva';
import { getRouteData, emptyArray } from '../utils/utils';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';

import logo from '../assets/logo.png';

const { Content, Header, Footer } = Layout;

class BasicLayout extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.routeList = getRouteData(props.routerData, 'BasicLayout');
        dispatch({
            type: 'global/basicLayoutInit',
            payload: this.routeList,
        });
    }

    handleMenuCollapse = collapsed => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    render() {
        const { collapsed, authMenuList } = this.props;
        return (
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
    }
}

BasicLayout.propTypes = {
    collapsed: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
    return {
        collapsed: state.global.collapsed,
        basicLayoutRouteList: state.global.basicLayoutRouteList,
        authMenuList: state.menu.authMenuList,
    };
};

export default connect(mapStateToProps)(BasicLayout);
