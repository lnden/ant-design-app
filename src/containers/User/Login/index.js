import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Button } from 'antd';
import styles from './login.module.less';

class Login extends Component {
    render() {
        return (
            <div className={styles.main}>
                <h3>登录页面</h3>
                <Button type="primary">
                    <Link to="/user/register">登录页面</Link>
                </Button>
            </div>
        );
    }
}

export default Login;
