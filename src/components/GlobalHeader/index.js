import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Icon, Avatar, Dropdown, Menu, Spin } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import NoticeIcon from '../NoticeIcon';
import styles from './index.module.less';

const MenuItem = Menu.Item;

class GlobalHeader extends Component {
    componentWillUnmount() {
        this.triggerResizeEvent.cancel();
    }

    handleToggle = () => {
        const { collapsed, onCollapse } = this.props;
        onCollapse(!collapsed);
        this.triggerResizeEvent();
    };

    /* eslint-disable*/
    @Debounce(6000)
    triggerResizeEvent() {
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }

    renderMenu = () => {
        const { onMenuClick } = this.props;
        return (
            <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
                <MenuItem key="accountSetting">
                    <Icon type="setting" />
                    账号设置
                </MenuItem>
                <Menu.Divider />
                <MenuItem key="logout">
                    <Icon type="logout" />
                    退出登录
                </MenuItem>
            </Menu>
        );
    };

    renderAvatar = () => {
        return <Avatar size="small" className={styles.avatar} icon="user" />;
    };

    renderDropDown = () => {
        const { profileLoading } = this.props;
        if (profileLoading) {
            return <Spin size="small" style={{ marginLeft: 8 }} />;
        }
        return (
            <Dropdown overlay={this.renderMenu()}>
                <span className={`${styles.action} ${styles.account}`}>
                    {this.renderAvatar()}
                    <span className={styles.name}>暂无</span>
                </span>
            </Dropdown>
        );
    };

    render() {
        const { collapsed } = this.props;
        return (
            <div className={styles.header}>
                <Icon
                    className={styles.trigger}
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.handleToggle}
                />
                <div className={styles.right}>
                    <Link to="/feedback">
                        <span className={styles.feedback}>
                            <Icon type="exclamation-circle" />
                            <span style={{ marginLeft: 5 }}>意见反馈</span>
                        </span>
                    </Link>
                    <Link to="/system/sysMsg">
                        <NoticeIcon className={styles.action} count={5} />
                    </Link>
                    {this.renderDropDown()}
                </div>
            </div>
        );
    }
}

export default GlobalHeader;
