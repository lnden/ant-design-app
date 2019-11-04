import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import styles from './index.module.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
    if (typeof icon === 'string') {
        if (icon.indexOf('http') === 0) {
            return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
        }
        return <Icon type={icon} />;
    }
    return icon;
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => [path,path2]
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
    menu.reduce((keys, item) => {
        keys.push(item.path);
        if (item.children) {
            return keys.concat(getFlatMenuKeys(item.children));
        }
        return keys;
    }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
    paths.reduce(
        (matchKeys, path) =>
            matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
        [],
    );

class SiderMenu extends Component {
    constructor(props) {
        super(props);
        this.flatMenuKeys = getFlatMenuKeys(props.menuData);
        this.state = {
            openKeys: this.getDefaultCollapsedSubMenus(props),
        };
    }

    componentWillReceiveProps(nextProps) {
        // const { location, menuData } = this.props;
        // console.log(this.props, 111111111111);
        // const { location: nextLocation, menuList: nextMenuList } = nextProps;
        // if (nextMenuList.length !== menuData.length) {
        //     this.flatMenuKeys = getFlatMenuKeys(nextMenuList);
        // }
        // if (nextLocation.pathname !== location.pathname) {
        //     this.setState({
        //         openKeys: this.getDefaultCollapsedSubMenus(nextProps),
        //     });
        // }
    }

    /**
     * Convert pathname to openKeys
     * /list/search/articles = > ['list','/list/search']
     * @param  props
     */
    getDefaultCollapsedSubMenus(props) {
        const {
            location: { pathname },
        } = props || this.props;
        this.flatMenuKeys = getFlatMenuKeys(props.menuData);

        return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
    }

    // permission to check
    checkPermissionItem = (authority, ItemDom) => {
        const { Authorized } = this.props;
        if (Authorized && Authorized.check) {
            const { check } = Authorized;
            return check(authority, ItemDom);
        }
        return ItemDom;
    };

    // 转化路径, 替换路径内多余'/'
    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    };

    getMenuItemPath = item => {
        const itemPath = this.conversionPath(item.path);
        const icon = getIcon(item.icon);
        const { target, name } = item;
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {icon}
                    <span>{name}</span>
                </a>
            );
        }
        const { location } = this.props;
        return (
            <Link to={itemPath} target={target} replace={itemPath === location.pathname}>
                {icon}
                <span>{name}</span>
            </Link>
        );
    };

    getSubMenuOrItem = item => {
        if (item.children && item.children.some(child => child.name)) {
            const childrenItems = this.getNavMenuItems(item.children);
            // 当无子菜单时就不展示菜单
            if (childrenItems && childrenItems.length > 0) {
                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <span>
                                    {getIcon(item.icon)}
                                    <span>{item.name}</span>
                                </span>
                            ) : (
                                item.name
                            )
                        }
                        key={item.path || item.url}
                    >
                        {childrenItems}
                    </SubMenu>
                );
            }
            return null;
        } else {
            return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
        }
    };

    getNavMenuItems = menusData => {
        if (!menusData) return [];
        return menusData
            .filter(item => item.name && !item.hideInMenu)
            .map(item => {
                const ItemDom = this.getSubMenuOrItem(item);
                return this.checkPermissionItem(item.authority, ItemDom);
            })
            .filter(item => item);
    };

    // Get the currently selected menu
    getSelectedMenuKeys = () => {
        const {
            location: { pathname },
        } = this.props;
        return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
    };

    render() {
        const { logo, menuData, collapsed } = this.props;
        const { openKeys } = this.state;
        const menuProps = collapsed ? {} : { openKeys };
        const theme = 'dark';
        // if pathname can't match, use the nearest parent's key
        let selectedKeys = this.getSelectedMenuKeys();
        if (!selectedKeys.length) {
            selectedKeys = [openKeys[openKeys.length - 1]];
        }
        return (
            <Sider trigger={null} collapsible collapsed={collapsed} className={styles.sider}>
                <div className={styles.logo}>
                    <Link to="/">
                        <img src={logo} alt="logo" />
                        <h1>Ant Design App</h1>
                    </Link>
                </div>
                <Menu
                    key="Menu"
                    theme={theme}
                    mode="inline"
                    {...menuProps}
                    selectedKeys={selectedKeys}
                >
                    {this.getNavMenuItems(menuData)}
                </Menu>
            </Sider>
        );
    }
}

export default SiderMenu;
