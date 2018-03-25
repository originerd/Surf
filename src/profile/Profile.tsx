import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from "react-navigation";

import { Stores, Types, Waves } from '../common';
import firebase from '../firebase';
import SessionStore from "../session/SessonStore";
import UserStore from "../user/UserStore";
import ProfileStore from './ProfileStore';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
});

interface ProfileInjectProps {
  profileStore: ProfileStore;
  userUID: string;
}

interface ProfileOwnProps {
  navigation: NavigationScreenProp<{ params?: { uid: string } }, {}>;
}

type ProfileProps =
  ProfileInjectProps &
  ProfileOwnProps;

class Profile extends React.Component<ProfileProps> {
  private get uid() {
    const { navigation, userUID } = this.props;
    const { params } = navigation.state;

    return (params && params.uid) || userUID;
  }

  private subscribeWaves = () => {
    const { profileStore } = this.props;

    firebase.database.subscribeWaves(
      this.uid,
      (snapshot) => {
        const wave: Types.Wave = snapshot.val();

        profileStore.prependWave(this.uid, wave);
      },
    );
  }

  public componentWillMount() {
    const { profileStore } = this.props;

    if (!profileStore.wavesByUID.get(this.uid)) {
      this.subscribeWaves();
    }
  }

  public componentWillUnmount() {
    const { navigation, profileStore, userUID } = this.props;

    const { params } = navigation.state;

    if (!params || params.uid && params.uid === userUID) {
      return;
    }

    profileStore.deleteWaves(params.uid);
  }

  public render() {
    const { wavesByUID } = this.props.profileStore;

    const waves = wavesByUID.get(this.uid) || [];

    return (
      <View style={styles.container}>
        <Waves waves={waves} />
      </View>
    );
  }
}

export default inject((stores: Stores, props: ProfileProps): ProfileInjectProps => ({
  profileStore: stores.profileStore,
  userUID: stores.sessionStore.user!.uid,
}))(observer(Profile));
