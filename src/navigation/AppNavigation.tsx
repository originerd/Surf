import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { Text } from 'react-native';

import { SplashScreen, Stores, Types } from '../common';
import Session from '../session';
import MainNavigation from './MainNavigation';

interface AppNavigationInjectProps {
  hasAuthChecked: boolean;
  user: Types.User | undefined;
}

type AppNavigationProps = AppNavigationInjectProps;

class AppNavigation extends React.Component<AppNavigationProps> {
  public render() {
    const { hasAuthChecked, user } = this.props;

    if (!hasAuthChecked) {
      return <SplashScreen />;
    }

    if (user) {
      return <MainNavigation />;
    }

    return <Session />;
  }
}

export default inject((stores: Stores): AppNavigationInjectProps => ({
  hasAuthChecked: stores.sessionStore.hasAuthChecked,
  user: stores.sessionStore.user,
}))(observer(AppNavigation));
