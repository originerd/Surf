import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Stores } from '../common';
import { feelingColors, typography } from '../styles';
import UserStore from "../user/UserStore";

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    display: 'flex',
  },
  feelingContainer: {
    height: 60,
  },
  profileContainer: {
    flexDirection: 'row',
    marginLeft: 76,
    marginRight: 8,
    paddingVertical: 8,
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
    left: 8,
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
  userStore: UserStore;
}

interface WavesHeaderOwnProps {
  uid?: string;
}

type WavesHeaderProps =
  WavesHeaderInjectProps &
  WavesHeaderOwnProps;

class WavesHeader extends React.Component<WavesHeaderProps> {
  public render() {
    const { uid, userStore } = this.props;

    const user = uid && userStore.users.get(uid);

    if (!uid || !user) {
      return null;
    }

    const { name, profileImageURL } = user;

    return (
      <View style={styles.container}>
        <View style={[styles.feelingContainer, { backgroundColor: feelingColors.happy }]} />
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImageURL }} style={styles.profileImage} />
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileContentContainer}>
            <Text style={styles.profileContentCount}>21</Text>
            <Text style={styles.profileContentTitle}>파도</Text>
          </View>
          <View style={styles.profileContentContainer}>
            <Text style={styles.profileContentCount}>37</Text>
            <Text style={styles.profileContentTitle}>팔로워</Text>
          </View>
          <View style={styles.profileContentContainer}>
            <Text style={styles.profileContentCount}>35</Text>
            <Text style={styles.profileContentTitle}>팔로잉</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default inject<Stores, WavesHeaderProps, WavesHeaderInjectProps>((stores) => ({
  userStore: stores.userStore,
}))(observer(WavesHeader));
