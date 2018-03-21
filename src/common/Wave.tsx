import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Types, Stores } from '../common';
import firebase from "../firebase";
import { colors, feelingColors, typography } from '../styles';
import UserStore from "../user/UserStore";

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 4,
    display: 'flex',
    marginHorizontal: 8,
    marginTop: 8,
    padding: 8,
  },
  feeling: {
    color: 'white',
    fontSize: typography.fontSizeSmall,
    fontWeight: 'bold',
  },
  feelingContainer: {
    borderRadius: 2,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
    borderRadius: 20,
    height: 40,
    overflow: 'hidden',
    width: 40,
  },
  profileName: {
    fontSize: typography.fontSizeMedium,
    marginLeft: 10,
  },
});

interface WaveInjectProps {
  userStore: UserStore;
}

interface WaveOwnProps {
  wave: Types.Wave;
}

type WaveProps =
  WaveInjectProps &
  WaveOwnProps;

class Wave extends React.Component<WaveProps> {
  private renderProfile = () => {
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {this.renderProfileImage()}
        </View>
        <Text style={styles.profileName}>
          {this.user && this.user.name}
        </Text>
      </View>
    );
  }

  private renderProfileImage = () => {
    if (!this.user) {
      return null;
    }

    return <Image source={{ uri: this.user.profileImageURL }} style={styles.profileImage} />;
  }

  private get user() {
    const { userStore, wave } = this.props;

    return userStore.users[wave.uid];
  }

  public async componentDidMount() {
    const { userStore, wave } = this.props;

    if (!this.user) {
      const storedUser = await firebase.database.getUser(wave.uid);

      userStore.setUser(storedUser);
    }
  }

  public render() {
    const { wave } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {this.renderProfile()}
          <View style={[styles.feelingContainer, { backgroundColor: feelingColors[wave.feeling] }]}>
            <Text style={styles.feeling}>
              {Types.Feelings[wave.feeling]}
            </Text>
          </View>
        </View>
        <Text>
          {wave.content}
        </Text>
      </View>
    );
  }
}

export default inject<Stores, WaveProps, WaveInjectProps>((stores) => ({
  userStore: stores.userStore,
}))(observer(Wave));
