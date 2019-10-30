import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Button } from 'antd';
import styles from './register.module.less';

class Register extends Component {
    render() {
        return (
            <div className={styles.main}>
                <h3>注册页面</h3>
                <Button type="primary">
                    <Link to="/user/resetPassword">注册页面</Link>
                </Button>
            </div>
        );
    }
}

export default Register;
