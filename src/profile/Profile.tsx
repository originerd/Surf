import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RNFirebase } from "react-native-firebase";
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
  private subscribeWaves = () => {
    const { profileStore } = this.props;

    if (!profileStore.referenceCountsByUId.get(this.uid)) {
      firebase.database.subscribeWaves(
        this.uid,
        this.subscribeWavesHandler,
      );
    }

    profileStore.increaseReferenceCount(this.uid);
  }

  private subscribeWavesHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { profileStore } = this.props;
    const wave: Types.Wave = snapshot.val();

    profileStore.prependWave(this.uid, wave);
  }

  private get uid() {
    const { navigation, userUID } = this.props;
    const { params } = navigation.state;

    return (params && params.uid) || userUID;
  }

  private unsubscribeWaves = () => {
    const { navigation, profileStore, userUID } = this.props;
    const { params } = navigation.state;

    profileStore.decreseReferenceCount(this.uid);

    if (!profileStore.referenceCountsByUId.get(this.uid)) {
      firebase.database.unsubscribeWaves(
        this.uid,
        this.subscribeWavesHandler,
      );

      profileStore.deleteWaves(this.uid);
    }
  }

  public componentWillMount() {
    this.subscribeWaves();
  }

  public componentWillUnmount() {
    this.unsubscribeWaves();
  }

  public render() {
    const { navigation } = this.props;
    const { wavesByUID } = this.props.profileStore;

    const waves = wavesByUID.get(this.uid) || [];

    return (
      <View style={styles.container}>
        <Waves
          uid={navigation.state.params && navigation.state.params.uid}
          waves={waves}
        />
      </View>
    );
  }
}

export default inject((stores: Stores, props: ProfileProps): ProfileInjectProps => ({
  profileStore: stores.profileStore,
  userUID: stores.sessionStore.user!.uid,
}))(observer(Profile));
