import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
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
    flatMenuKeys = [];

    constructor(props) {
        super(props);
        this.state = {
            openKeys: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        const { location, menuData } = this.props;
        const { location: nextLocation, menuData: nextMenuList } = nextProps;
        if (nextMenuList.length !== menuData.length) {
            this.flatMenuKeys = getFlatMenuKeys(nextMenuList);
        }
        if (nextLocation.pathname !== location.pathname) {
            this.setState({
                openKeys: this.getDefaultCollapsedSubMenus(nextProps),
            });
        }
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

    // 转化路径, 替换路径内多余'/'
    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    };

    /**
     * @name 获取Menu Item Path
     * @param item
     * @returns {*}
     */
    getMenuItemPath = item => {
        const itemPath = this.conversionPath(item.path);
        const icon = getIcon(item.icon);
        const { target, name } = item;
        // Is it a http link
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

    /**
     * @name get subMenu or Item
     * @param item
     * @returns {*}
     */
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

    /**
     * @name get menu node
     * @param menuList
     * @returns {*}
     */
    getNavMenuItems = menuList => {
        if (!menuList) return [];
        return menuList
            .filter(item => item.name && !item.hideInMenu)
            .map(item => this.getSubMenuOrItem(item));
    };

    // Get the currently selected menu
    getSelectedMenuKeys = () => {
        const {
            location: { pathname },
        } = this.props;
        return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
    };

    isMainMenu = key => {
        const { menuData } = this.props;
        return menuData.some(
            item => key && (item.key === key || item.path === key || item.url === key),
        );
    };

    // 展开收起菜单函数
    handleOpenChange = openKeys => {
        const lastOpenKey = openKeys[openKeys.length - 1];
        const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
        this.setState({
            openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
        });
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
                <div className={styles.logo} key="logo">
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
                    onOpenChange={this.handleOpenChange}
                    selectedKeys={selectedKeys}
                >
                    {this.getNavMenuItems(menuData)}
                </Menu>
            </Sider>
        );
    }
}

export default SiderMenu;
