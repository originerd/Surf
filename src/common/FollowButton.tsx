import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';

import firebase from '../firebase';
import { typography } from '../styles';
import { Stores } from './stores';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    height: 36,
    justifyContent: 'center',
    width: 64,
  },
  text: {
    fontSize: typography.fontSizeMedium,
  },
});

interface FollowButtonInjectProps {
  followingUIDs: string[];
  sessionUserUID: string;
}

interface FollowButtonOwnProps {
  uid: string | undefined;
}

type FollowButtonProps =
  FollowButtonInjectProps &
  FollowButtonOwnProps;

class FollowButton extends React.Component<FollowButtonProps> {
  private get hasUserBeenFollowed() {
    const { followingUIDs, sessionUserUID, uid } = this.props;

    return uid && followingUIDs.indexOf(uid) > -1;
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

  public render() {
    const { sessionUserUID, uid } = this.props;

    if (!uid || sessionUserUID === uid) {
      return null;
    }

    return (
      <TouchableHighlight
        onPress={this.toggleFollow}
        style={styles.container}
        underlayColor="rgba(255, 255, 255, .5)"
      >
        <Text style={styles.text}>
          {this.hasUserBeenFollowed ? '언팔로우' : '팔로우'}
        </Text>
      </TouchableHighlight>
    );
  }
}

export default inject<Stores, FollowButtonProps, FollowButtonInjectProps>(stores => ({
  followingUIDs: stores.sessionStore.followingUIDs,
  sessionUserUID: stores.sessionStore.user!.uid,
}))(observer(FollowButton));
