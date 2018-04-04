import { inject, observer } from "mobx-react/native";
import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  NavigationScreenProp,
  TabNavigator,
} from 'react-navigation';

import { getPlatformIconName, Stores } from '../common';
import Ocean from '../ocean';
import Profile from '../profile';
import Timeline from '../timeline';
import { colors } from '../styles';
import NavigationStore from './NavigationStore';

const IOS_TAB_HEIGHT = 48.5;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  tabBar: {
    backgroundColor: colors.blue,
  },
  writeButtonContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightBlue,
    borderRadius: 32,
    bottom: Platform.select({ android: 0, ios: IOS_TAB_HEIGHT }) + 24,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    shadowColor: colors.darkerBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: .5,
    shadowRadius: 2,
    width: 56,
  },
});

const getNavigationOption = (iconName: string) => ({
  tabBarIcon: ({ focused, tintColor }: { focused: boolean, tintColor: string }) => (
    <Icon color={tintColor} name={getPlatformIconName(iconName)} size={24} />
  ),
});

const TabNavigation = TabNavigator(
  {
    Timeline: {
      navigationOptions: getNavigationOption('home'),
      screen: Timeline,
    },
    Ocean: {
      navigationOptions: getNavigationOption('boat'),
      screen: Ocean,
    },
    Profile: {
      navigationOptions: getNavigationOption('person'),
      screen: Profile,
    },
  },
  {
    lazy: true,
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: colors.lighterBlue,
      showLabel: false,
      showIcon: true,
      style: styles.tabBar,
    },
  },
);

interface HomeNavigationInjectProps {
  navigationStore: NavigationStore;
}

interface HomeNavigationOwnProps {
  navigation: NavigationScreenProp<{}, {}>;
}

type HomeNavigationProps =
  HomeNavigationInjectProps &
  HomeNavigationOwnProps;

class HomeNavigation extends React.Component<HomeNavigationProps> {
  private navigateToWrite = () => {
    const { mainNavigation } = this.props.navigationStore;

    mainNavigation.navigate('Write');
  }

  public componentDidMount() {
    const { navigation, navigationStore } = this.props;

    navigationStore.setMainNavigation(navigation);
  }

  public render() {
    return (
      <View style={styles.container}>
        <TabNavigation />
        <TouchableHighlight
          onPress={this.navigateToWrite}
          style={styles.writeButtonContainer}
          underlayColor={colors.blue}
        >
          <Icon color="white" name={getPlatformIconName('moon')} size={24} />
        </TouchableHighlight>
      </View>
    );
  }
}

export default inject((stores: Stores): HomeNavigationInjectProps => ({
  navigationStore: stores.navigationStore,
}))(observer(HomeNavigation));
