import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Stores, Types } from '../common';
import firebase from '../firebase';
import NavigationStore from '../navigation/NavigationStore';
import { colors, feelingColors, typography } from '../styles';
import UserStore from '../user/UserStore';
import FollowButton from '../common/FollowButton';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 12,
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileImage: {
    flex: 1,
  },
  profileImageContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 18,
    height: 36,
    overflow: 'hidden',
    width: 36,
  },
  profileName: {
    color: 'whitesmoke',
    fontSize: typography.fontSizeMedium,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

interface FollowInjectProps {
  navigationStore: NavigationStore;
  userStore: UserStore;
}

interface FollowOwnProps {
  follow: Types.Follow;
}

type FollowProps =
  FollowInjectProps &
  FollowOwnProps;

class Follow extends React.Component<FollowProps> {
  private get feelingBackgroundColor() {
    if (!this.user || !this.user.feelingCounts) {
      return { backgroundColor: 'gray' };
    }

    const { feelingCounts } = this.user;
    const feelings = Object.keys(feelingCounts) as Types.FeelingTypes[];

    const feeling = feelings.reduce(
      (result, currentFeeling) =>
        (feelingCounts[currentFeeling]! > feelingCounts[result]!) ? currentFeeling : result,
      feelings[0],
    );

    return { backgroundColor: feelingColors[feeling] };
  }

  private navigateToProfile = () => {
    const { navigationStore, follow } = this.props;
    const { uid } = follow;
    const userName = this.user && this.user.name;

    navigationStore.mainNavigation.navigate('Profile', { uid, userName });
  }

  private renderProfile = () => {
    const userName = this.user && this.user.name;

    return (
      <TouchableWithoutFeedback onPress={this.navigateToProfile}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            {this.renderProfileImage()}
          </View>
          <Text style={styles.profileName}>
            {userName}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  private renderProfileImage = () => {
    if (!this.user) {
      return null;
    }

    return <Image source={{ uri: this.user.profileImageURL }} style={styles.profileImage} />;
  }

  private get user() {
    const { follow, userStore } = this.props;

    return userStore.users.get(follow.uid);
  }

  public async componentDidMount() {
    const { follow, userStore } = this.props;

    if (!this.user) {
      const storedUser = await firebase.database.getUser(follow.uid);

      userStore.setUser(storedUser);
    }
  }

  public render() {
    const { follow } = this.props;

    return (
      <View style={[styles.container, this.feelingBackgroundColor]}>
        {this.renderProfile()}
        <FollowButton uid={follow.uid} />
      </View>
    );
  }
}

export default inject<Stores, FollowProps, FollowInjectProps>(stores => ({
  navigationStore: stores.navigationStore,
  userStore: stores.userStore,
}))(observer(Follow));
