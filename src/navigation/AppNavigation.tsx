import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Text } from 'react-native';

import { Loading, Stores, Types } from '../common';
import Session from '../session';
import MainNavigation from './MainNavigation';

interface AppNavigationInjectProps {
  hasAuthChecked: boolean;
  user?: Types.User;
}

type AppNavigationProps = Partial<AppNavigationInjectProps>;

@inject((stores: Stores): AppNavigationProps => ({
  hasAuthChecked: stores.sessionStore.hasAuthChecked,
  user: stores.sessionStore.user,
}))
@observer
class AppNavigation extends React.Component<AppNavigationProps> {
  public render() {
    const { hasAuthChecked, user } = this.props as AppNavigationProps;

    if (!hasAuthChecked) {
      return <Loading />;
    }

    if (user) {
      return <MainNavigation />;
    }

    return <Session />;
  }
}

export default AppNavigation;
