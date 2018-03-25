import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  uid: string;
}

type ProfileProps = ProfileInjectProps;

class Profile extends React.Component<ProfileProps> {
  private subscribeWaves = () => {
    const { profileStore, uid } = this.props;

    firebase.database.subscribeWaves(
      uid,
      (snapshot) => {
        const wave: Types.Wave = snapshot.val();

        profileStore.prependWave(uid, wave);
      },
    );
  }

  public async componentWillMount() {
    this.subscribeWaves();
  }

  public render() {
    const { uid } = this.props;
    const { wavesByUID } = this.props.profileStore;

    const waves = wavesByUID.get(uid) || [];

    return (
      <View style={styles.container}>
        <Waves waves={waves} />
      </View>
    );
  }
}

export default inject((stores: Stores, props: ProfileProps): ProfileInjectProps => ({
  profileStore: stores.profileStore,
  uid: props.uid || stores.sessionStore.user!.uid,
}))(observer(Profile));
