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
  private subscribeUser = () => {
    const { userStore } = this.props;

    if (!userStore.referenceCountsByUId.get(this.uid)) {
      firebase.database.subscribeUser(
        this.uid,
        this.subscribeUserHandler,
      );
    }

    userStore.increaseReferenceCount(this.uid);
  }

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
    const { navigation, userStore } = this.props;
    const { params } = navigation.state;

    userStore.decreseReferenceCount(this.uid);

    if (!userStore.referenceCountsByUId.get(this.uid)) {
      firebase.database.unsubscribeUser(
        this.uid,
        this.subscribeUserHandler,
      );
    }
  }

  private unsubscribeWaves = () => {
    const { navigation, profileStore } = this.props;
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
    this.subscribeUser();
    this.subscribeWaves();
  }

  public componentWillUnmount() {
    this.unsubscribeUser();
    this.unsubscribeWaves();
  }

  public render() {
    const { navigation } = this.props;
    const { wavesByUID } = this.props.profileStore;

    const waves = wavesByUID.get(this.uid) || [];

    return (
      <View style={styles.container}>
        <Waves
          uid={this.uid}
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
