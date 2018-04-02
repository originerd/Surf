import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Stores, Types, Waves } from '../common';
import firebase from '../firebase';
import OceanStore from './OceanStore';
import { RNFirebase } from 'react-native-firebase';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
});

interface OceanInjectProps {
  oceanStore: OceanStore;
  user: Types.User;
}

type OceanProps = OceanInjectProps;

class Ocean extends React.Component<OceanProps> {
  private getOcean = async (isMore?: boolean) => {
    const { uid } = this.props.user;
    const {
      appendWaves,
      loadedAllWaves,
      loadingWaves,
      setLoadedAllWaves,
      setLoadingWaves,
      waves,
    } = this.props.oceanStore;

    if (loadedAllWaves || loadingWaves) {
      return;
    }

    const lastWave = waves[waves.length - 1];
    const endAt = isMore && lastWave && lastWave.waveID || undefined;

    setLoadingWaves(true);

    const loadedWaves = await firebase.database.getWaves(
      Types.getWavePath(Types.WavePathWithoutUIDTypes.ocean),
      endAt,
    );
    appendWaves(loadedWaves)

    if (loadedWaves.length === 0) {
      setLoadedAllWaves();
    }

    setLoadingWaves(false);
  }

  private subscribeOcean = async () => {
    const { oceanStore, user } = this.props;

    await this.getOcean();

    const firstWave = oceanStore.waves[0];
    const startAt = firstWave && firstWave.waveID || undefined;

    firebase.database.subscribeWaves(
      Types.getWavePath(Types.WavePathWithoutUIDTypes.ocean),
      startAt,
      this.subscribeOceanHandler,
    );
  }

  private subscribeOceanHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { oceanStore } = this.props;
    const wave: Types.Wave = snapshot.val();

    oceanStore.prependWave(wave);
  }

  public async componentDidMount() {
    this.subscribeOcean();
  }

  public render() {
    const { loadingWaves, waves } = this.props.oceanStore;

    return (
      <View style={styles.container}>
        <Waves
          getMoreWaves={() => this.getOcean(true)}
          isLoadingWaves={loadingWaves}
          waves={waves}
        />
      </View>
    );
  }
}

export default inject((stores: Stores): OceanInjectProps => ({
  oceanStore: stores.oceanStore,
  user: stores.sessionStore.user!,
}))(observer(Ocean));
