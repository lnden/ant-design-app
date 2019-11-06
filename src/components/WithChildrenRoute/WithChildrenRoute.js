import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'dva/router';
import { emptyArray } from '../../utils/utils';

export default Target => {
    return class WithChildrenRoute extends PureComponent {
        static propTypes = {
            match: PropTypes.object.isRequired,
            routeList: PropTypes.array.isRequired,
        };

        render() {
            const { match, routeList } = this.props;
            return (
                <Switch>
                    {routeList.map(item => (
                        <Route
                            key={`${match.path}/${item.path}`}
                            path={`${match.path}/${item.path}`}
                            render={props => {
                                const ItemComponent = item.component;
                                return (
                                    <ItemComponent
                                        {...props}
                                        routeList={item.children || emptyArray}
                                    />
                                );
                            }}
                            exact={item.exact}
                        />
                    ))}
                    {Target ? (
                        <Route component={Target} />
                    ) : (
                        <Redirect to={`${match.path}/${routeList[0].path}`} from={match.path} />
                    )}
                </Switch>
            );
        }
    };
};
