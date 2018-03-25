import { inject, observer } from "mobx-react/native";
import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  NavigationScreenProp,
  TabNavigator,
} from 'react-navigation';

import Ocean from '../ocean';
import Profile from '../profile';
import Timeline from '../timeline';
import { colors } from '../styles';
import NavigationStore from './NavigationStore';
import { Stores } from '../common';

const IOS_TAB_HEIGHT = 48.5;

const styles = StyleSheet.create({
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

const TabNavigation = TabNavigator(
  {
    Timeline: { screen: Timeline },
    Ocean: { screen: Ocean },
    Profile: { screen: Profile },
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
  public componentWillMount() {
    const { navigation, navigationStore } = this.props;

    navigationStore.setMainNavigation(navigation);
  }

  public navigateToWrite = () => {
    const { mainNavigation } = this.props.navigationStore;

    mainNavigation.navigate('Write');
  }

  public render() {
    return (
      <View style={{ display: 'flex', flex: 1 }}>
        <TabNavigation />
        <TouchableHighlight
          onPress={this.navigateToWrite}
          style={styles.writeButtonContainer}
          underlayColor={colors.blue}
        >
          <Icon color="white" name="pencil" size={24} />
        </TouchableHighlight>
      </View>
    );
  }
}

export default inject((stores: Stores): HomeNavigationInjectProps => ({
  navigationStore: stores.navigationStore,
}))(observer(HomeNavigation));
