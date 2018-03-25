import * as React from 'react';
import { Text } from 'react-native';
import { StackNavigator, NavigationScreenProp } from "react-navigation";

import { colors } from '../styles';
import Profile from "../profile";
import Write from "../write";
import HomeNavigation from './HomeNavigation';

const MainNavigation = StackNavigator(
  {
    Home: { screen: HomeNavigation },
    Profile: {
      navigationOptions: ({ navigation }: { navigation: NavigationScreenProp<{ params: { userName: string }},{}> }) => ({
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
