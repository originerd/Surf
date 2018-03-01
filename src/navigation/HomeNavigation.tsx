import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { TabNavigator } from 'react-navigation';

import { colors } from '../styles';

const IOS_TAB_HEIGHT = 48.5;

const styles = StyleSheet.create({
  writeButtonContainer: {
    backgroundColor: colors.lightBlue,
    borderRadius: 32,
    bottom: Platform.select({ android: 0, ios: IOS_TAB_HEIGHT }) + 24,
    height: 56,
    position: 'absolute',
    right: 16,
    shadowColor: colors.darkerBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: .5,
    shadowRadius: 2,
    width: 56,
  },
});

const TabNavigation = TabNavigator(
  {
    Timeline: { screen: () => <Text>Timeline</Text> },
    Ocean: { screen: () => <Text>Ocean</Text> },
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

const HomeNavigation = () => (
  <View style={{ display: 'flex', flex: 1 }}>
    <TabNavigation />
    <TouchableHighlight
      onPress={() => null}
      style={styles.writeButtonContainer}
      underlayColor={colors.blue}
    >
      <View />
    </TouchableHighlight>
  </View>
)

export default HomeNavigation;
