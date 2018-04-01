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
  userStore: UserStore;
  sessionUserUID: string;
}

interface ProfileOwnProps {
  navigation: NavigationScreenProp<{ params?: { uid: string } }, {}>;
}

type ProfileProps =
  ProfileInjectProps &
  ProfileOwnProps;

class Profile extends React.Component<ProfileProps> {
  private getWaves = async () => {
    const { uid } = this;
    const { profileStore } = this.props;

    const waves = await firebase.database.getWaves(uid);

    profileStore.appendWaves(uid, waves)
  }

  private subscribeUser = () => {
    const { uid } = this;
    const { userStore } = this.props;

    if (!userStore.referenceCountsByUId.get(uid)) {
      firebase.database.subscribeUser(
        uid,
        this.subscribeUserHandler,
      );
    }

    userStore.increaseReferenceCount(uid);
  }

  private subscribeWaves = async () => {
    const { profileStore } = this.props;

    if (!profileStore.referenceCountsByUId.get(this.uid)) {
      await this.getWaves();

      const waves = this.waves;
      const firstWave = waves[0];
      const firstKey = firstWave && firstWave.waveID || undefined;

      firebase.database.subscribeWaves(
        this.uid,
        firstKey,
        this.subscribeWavesHandler,
      );
    }

    profileStore.increaseReferenceCount(this.uid);
  }

  private subscribeUserHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { userStore } = this.props;
    const user: Types.User = snapshot.val();

    userStore.users.set(this.uid, user);
  }

  private subscribeWavesHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { profileStore } = this.props;
    const wave: Types.Wave = snapshot.val();

    profileStore.prependWave(this.uid, wave);
  }

  private get uid() {
    const { navigation, sessionUserUID } = this.props;
    const { params } = navigation.state;

    return (params && params.uid) || sessionUserUID;
  }

  private unsubscribeUser = () => {
    const { uid } = this;
    const { navigation, userStore } = this.props;
    const { params } = navigation.state;

    userStore.decreseReferenceCount(uid);

    if (!userStore.referenceCountsByUId.get(uid)) {
      firebase.database.unsubscribeUser(
        uid,
        this.subscribeUserHandler,
      );
    }
  }

  private unsubscribeWaves = () => {
    const { uid } = this;
    const { navigation, profileStore } = this.props;
    const { params } = navigation.state;

    profileStore.decreseReferenceCount(uid);

    if (!profileStore.referenceCountsByUId.get(uid)) {
      firebase.database.unsubscribeWaves(
        uid,
        this.subscribeWavesHandler,
      );

      profileStore.deleteWaves(uid);
    }
  }

  private get waves() {
    const { profileStore } = this.props;

    return profileStore.wavesByUID.get(this.uid) || [];
  }

  public async componentWillMount() {
    this.subscribeUser();
    await this.subscribeWaves();
  }

  public componentWillUnmount() {
    this.unsubscribeUser();
    this.unsubscribeWaves();
  }

  public render() {
    const { uid } = this;
    const { navigation, profileStore } = this.props;

    const waves = profileStore.wavesByUID.get(uid) || [];

    return (
      <View style={styles.container}>
        <Waves
          uid={uid}
          waves={waves}
        />
      </View>
    );
  }
}

export default inject((stores: Stores, props: ProfileProps): ProfileInjectProps => ({
  profileStore: stores.profileStore,
  userStore: stores.userStore,
  sessionUserUID: stores.sessionStore.user!.uid,
}))(observer(Profile));
