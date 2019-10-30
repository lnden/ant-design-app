import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';

export default class NoticeIcon extends Component {
    render() {
        const { className, count } = this.props;
        const noticeButtonClass = classNames(className, styles.noticeButton);
        return (
            <span className={noticeButtonClass}>
                <Badge count={count} className={styles.badge}>
                    <Icon type="bell" className={styles.icon} />
                </Badge>
                系统消息
            </span>
        );
    }
}
