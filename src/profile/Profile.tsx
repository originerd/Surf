import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { RNFirebase } from 'react-native-firebase';

import { Loading, Stores, Types, Waves } from '../common';
import firebase from '../firebase';
import { ProfileNavigationOptionsParams } from '../navigation/MainNavigation';
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

interface ProfileOwnProps extends ProfileNavigationOptionsParams {}

type ProfileProps =
  ProfileInjectProps &
  ProfileOwnProps;

class Profile extends React.Component<ProfileProps> {
  private getWaves = async (isMore?: boolean) => {
    const { profileStore } = this.props;

    const loadedAllWaves = profileStore.loadedAllWavesByUID.get(this.uid);
    const loadingWaves = profileStore.loadingWavesByUID.get(this.uid);

    if (loadedAllWaves || loadingWaves) {
      return;
    }

    profileStore.setLoadingWaves(this.uid, true);

    const lastWave = this.waves.length > 0 && this.waves[this.waves.length - 1];
    const endAt = isMore && lastWave && lastWave.waveID || undefined;

    const loadedWaves = await firebase.database.getWaves(
      { path: firebase.database.PathTypes.waves, uid: this.uid, feeling: 'total' },
      endAt,
    );
    profileStore.appendWaves(this.uid, loadedWaves);

    if (loadedWaves.length === 0) {
      profileStore.setLoadedAllWaves(this.uid);
    }

    profileStore.setLoadingWaves(this.uid, false);
  }

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

  private subscribeWaves = async () => {
    const { profileStore } = this.props;

    if (!profileStore.referenceCountsByUID.get(this.uid)) {
      await this.getWaves();

      const firstWave = this.waves.length > 0 && this.waves[0];
      const startAt = firstWave && firstWave.waveID || undefined;

      firebase.database.subscribeWaves(
        { path: firebase.database.PathTypes.waves, uid: this.uid, feeling: 'total' },
        startAt,
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

    if (!profileStore.referenceCountsByUID.get(this.uid)) {
      firebase.database.unsubscribeWaves(
        { path: firebase.database.PathTypes.waves, uid: this.uid, feeling: 'total' },
        this.subscribeWavesHandler,
      );

      profileStore.deleteWaves(this.uid);
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
    const { navigation, profileStore, sessionUserUID } = this.props;

    const waves = profileStore.wavesByUID.get(this.uid) || [];
    const loadingWaves = profileStore.loadingWavesByUID.get(this.uid);

    if (waves.length === 0 && loadingWaves) {
      return <Loading />;
    }

    return (
      <View style={styles.container}>
        <Waves
          getMoreWaves={() => this.getWaves(true)}
          isSessionUsers={sessionUserUID === this.uid}
          loadingWaves={loadingWaves}
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
