import * as React from 'react';
import { Text } from 'react-native';
import { TabNavigator } from 'react-navigation';

import { colors } from '../styles';

const HomeNavigation = TabNavigator(
  {
    Timeline: { screen: () => <Text>Timeline</Text> },
    Surfs: { screen: () => <Text>Surfs</Text> },
    Me: { screen: () => <Text>Me</Text> },
  },
  {
    lazy: true,
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: colors.blue,
      inactiveTintColor: 'gray',
    },
  },
);

export default HomeNavigation;
