import * as React from 'react';
import { Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import { colors } from '../styles';
import Write from "../write";
import HomeNavigation from './HomeNavigation';

const MainNavigation = StackNavigator(
  {
    Home: { screen: HomeNavigation },
    Write: {
      navigationOptions: {
        title: 'Write',
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
