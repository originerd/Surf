import * as React from 'react';
import { Text } from 'react-native';
import { StackNavigator, NavigationScreenProp } from 'react-navigation';

import { Types } from '../common';
import Follows from '../follow/index';
import { colors } from '../styles';
import Profile from '../profile';
import Write from '../write';
import HomeNavigation from './HomeNavigation';

interface FollowsNavigationOptionsParams {
  navigation: NavigationScreenProp<{ params: { type: Types.FollowTypes; uid: string; } }, {}>;
}

interface ProfileNavigationOptionsParams {
  navigation: NavigationScreenProp<{ params: { userName: string } }, {}>;
}

const MainNavigation = StackNavigator(
  {
    Home: { screen: HomeNavigation },
    Follows: {
      navigationOptions: ({ navigation }: FollowsNavigationOptionsParams) => ({
        title: navigation.state.params.type === Types.FollowTypes.followers ? '팔로워' : '팔로잉',
      }),
      screen: Follows,
    },
    Profile: {
      navigationOptions: ({ navigation }: ProfileNavigationOptionsParams) => ({
        title: navigation.state.params.userName,
      }),
      screen: Profile,
    },
    Write: {
      navigationOptions: {
        title: '파도만들기',
      },
      screen: Write,
    },
  },
  {
    navigationOptions: {
      title: 'Surf',
    },
  },
);

export default MainNavigation;
