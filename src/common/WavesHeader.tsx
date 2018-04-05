import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Stores, Types } from '../common';
import firebase from '../firebase';
import { feelingColors, typography } from '../styles';
import UserStore from '../user/UserStore';

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
  followButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    height: 36,
    justifyContent: 'center',
    width: 64,
  },
  followButtonText: {
    fontSize: typography.fontSizeMedium,
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
  followingUIDs: string[];
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

  private get hasUserBeenFollowed() {
    const { followingUIDs, sessionUserUID, uid } = this.props;

    return uid && followingUIDs.indexOf(uid) > -1;
  }

  private renderFollowButton = () => {
    const { followingUIDs, sessionUserUID, uid } = this.props;

    if (!uid || sessionUserUID === uid) {
      return null;
    }

    return (
      <TouchableHighlight
        onPress={this.toggleFollow}
        style={styles.followButton}
        underlayColor="rgba(255, 255, 255, .5)"
      >
        <Text style={styles.followButtonText}>
          {this.hasUserBeenFollowed ? '언팔로우' : '팔로우'}
        </Text>
      </TouchableHighlight>
    );
  }

  private toggleFollow = () => {
    const { sessionUserUID, uid } = this.props;

    if (!uid) {
      return;
    }

    if (this.hasUserBeenFollowed) {
      firebase.database.unfollow(sessionUserUID, uid);
    } else {
      firebase.database.follow(sessionUserUID, uid);
    }
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

    const { followerCount, followingCount, name, profileImageURL, waveCount } = this.user;

    return (
      <View style={styles.container}>
        <View style={[styles.feelingContainer, this.feelingBackgroundColor]}>
          {this.renderFollowButton()}
        </View>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImageURL }} style={styles.profileImage} />
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileContentContainer}>
            <Text style={styles.profileContentCount}>{waveCount}</Text>
            <Text style={styles.profileContentTitle}>파도</Text>
          </View>
          <View style={styles.profileContentContainer}>
            <Text style={styles.profileContentCount}>{followerCount}</Text>
            <Text style={styles.profileContentTitle}>팔로워</Text>
          </View>
          <View style={styles.profileContentContainer}>
            <Text style={styles.profileContentCount}>{followingCount}</Text>
            <Text style={styles.profileContentTitle}>팔로잉</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default inject<Stores, WavesHeaderProps, WavesHeaderInjectProps>(stores => ({
  followingUIDs: stores.sessionStore.followingUIDs,
  sessionUserUID: stores.sessionStore.user!.uid,
  userStore: stores.userStore,
}))(observer(WavesHeader));
