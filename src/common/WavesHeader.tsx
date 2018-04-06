import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { Stores, Types } from '../common';
import NavigationStore from '../navigation/NavigationStore';
import { feelingColors, typography } from '../styles';
import UserStore from '../user/UserStore';
import FollowButton from './FollowButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    display: 'flex',
  },
  feelingContainer: {
    alignItems: 'flex-end',
    height: 60,
    justifyContent: 'center',
    padding: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    marginLeft: 76,
    marginRight: 12,
    paddingVertical: 12,
  },
  profileContentContainer: {
    alignItems: 'center',
    flex: 1,
  },
  profileContentCount: {
    fontSize: typography.fontSizeMedium,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileContentTitle: {
    color: 'gray',
    fontSize: typography.fontSizeSmall,
  },
  profileImage: {
    flex: 1,
  },
  profileImageContainer: {
    backgroundColor: 'lightgray',
    borderColor: 'dimgray',
    borderRadius: 30,
    borderWidth: 1,
    height: 60,
    left: 12,
    overflow: 'hidden',
    position: 'absolute',
    top: 30,
    width: 60,
  },
  profileName: {
    fontSize: typography.fontSizeMedium,
    fontWeight: 'bold',
  },
});

interface WavesHeaderInjectProps {
  navigationStore: NavigationStore;
  sessionUserUID: string;
  userStore: UserStore;
}

interface WavesHeaderOwnProps {
  uid?: string;
}

type WavesHeaderProps =
  WavesHeaderInjectProps &
  WavesHeaderOwnProps;

class WavesHeader extends React.Component<WavesHeaderProps> {
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

  private navigateToFollows = (type: Types.FollowTypes) =>
    () => {
      const { navigationStore, uid } = this.props;

      navigationStore.mainNavigation.navigate('Follows', { type, uid });
    }

  private get user() {
    const { uid, userStore } = this.props;

    if (!uid) {
      return null;
    }

    return userStore.users.get(uid);
  }

  public render() {
    if (!this.user) {
      return null;
    }

    const { followerCount, followingCount, name, profileImageURL, uid, waveCount } = this.user;

    return (
      <View style={styles.container}>
        <View style={[styles.feelingContainer, this.feelingBackgroundColor]}>
          <FollowButton uid={uid} />
        </View>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImageURL }} style={styles.profileImage} />
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileContentContainer}>
            <Text style={styles.profileContentCount}>{waveCount}</Text>
            <Text style={styles.profileContentTitle}>파도</Text>
          </View>
          <TouchableHighlight
            onPress={this.navigateToFollows(Types.FollowTypes.followers)}
            style={styles.profileContentContainer}
            underlayColor="transparent"
          >
            <View style={styles.profileContentContainer}>
              <Text style={styles.profileContentCount}>{followerCount}</Text>
              <Text style={styles.profileContentTitle}>팔로워</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.navigateToFollows(Types.FollowTypes.followings)}
            style={styles.profileContentContainer}
            underlayColor="transparent"
          >
            <View style={styles.profileContentContainer}>
              <Text style={styles.profileContentCount}>{followingCount}</Text>
              <Text style={styles.profileContentTitle}>팔로잉</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default inject<Stores, WavesHeaderProps, WavesHeaderInjectProps>(stores => ({
  followingUIDs: stores.sessionStore.followingUIDs,
  navigationStore: stores.navigationStore,
  sessionUserUID: stores.sessionStore.user!.uid,
  userStore: stores.userStore,
}))(observer(WavesHeader));
