import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'dva/router';
import { Layout } from 'antd';
import { getRouteData } from '../utils/utils';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';

const { Content, Header, Footer, Sider } = Layout;

class BasicLayout extends Component {
    constructor(props) {
        super(props);
        this.routeList = getRouteData(props.routerData, 'BasicLayout');
    }

    render() {
        return (
            <Layout>
                <Sider>我是左侧导航内容区域</Sider>
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <GlobalHeader />
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
                        <GlobalFooter copyright={<>© 2019 北京xxxx科技有限公司</>} />
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default BasicLayout;
