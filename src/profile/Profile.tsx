import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RNFirebase } from 'react-native-firebase';
import { NavigationScreenProp } from 'react-navigation';

import { Loading, Stores, Types, Waves } from '../common';
import firebase from '../firebase';
import SessionStore from '../session/SessonStore';
import UserStore from '../user/UserStore';
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
  private getWaves = async (isMore?: boolean) => {
    const { uid, waves } = this;
    const { profileStore } = this.props;

    if (profileStore.loadedAllWavesByUID.get(uid) || profileStore.loadingWavesByUID.get(uid)) {
      return;
    }

    const lastWave = waves.length > 0 && waves[waves.length - 1];
    const endAt = isMore && lastWave && lastWave.waveID || undefined;

    profileStore.setLoadingWaves(uid, true);

    const loadedWaves = await firebase.database.getWaves(
      { path: firebase.database.PathTypes.waves, uid, feeling: 'total' },
      endAt,
    );
    profileStore.appendWaves(uid, loadedWaves);

    if (loadedWaves.length === 0) {
      profileStore.setLoadedAllWaves(uid);
    }

    profileStore.setLoadingWaves(uid, false);
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
    const { uid } = this;
    const { profileStore } = this.props;

    if (!profileStore.referenceCountsByUID.get(this.uid)) {
      await this.getWaves();

      // should get waves after getTimeline function call has been finished
      const { waves } = this;

      const firstWave = waves.length > 0 && waves[0];
      const startAt = firstWave && firstWave.waveID || undefined;

      firebase.database.subscribeWaves(
        { path: firebase.database.PathTypes.waves, uid, feeling: 'total' },
        startAt,
        this.subscribeWavesHandler,
      );
    }

    profileStore.increaseReferenceCount(uid);
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

    if (!profileStore.referenceCountsByUID.get(uid)) {
      firebase.database.unsubscribeWaves(
        { path: firebase.database.PathTypes.waves, uid, feeling: 'total' },
        this.subscribeWavesHandler,
      );

      profileStore.deleteWaves(uid);
    }
  }

  private get waves() {
    const { profileStore } = this.props;

    return profileStore.wavesByUID.get(this.uid) || [];
  }

  public async componentDidMount() {
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
    const loadingWaves = profileStore.loadingWavesByUID.get(uid);

    if (waves.length === 0 && loadingWaves) {
      return <Loading />;
    }

    return (
      <View style={styles.container}>
        <Waves
          getMoreWaves={() => this.getWaves(true)}
          loadingWaves={loadingWaves}
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
