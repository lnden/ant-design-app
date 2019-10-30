import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Button } from 'antd';
import styles from './resetPassword.module.less';

class ResetPassword extends Component {
    render() {
        return (
            <div className={styles.main}>
                <h3>重置密码页面</h3>
                <Button type="primary">
                    <Link to="/user/login">重置密码页面</Link>
                </Button>
            </div>
        );
    }
}

export default ResetPassword;
