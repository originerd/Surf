import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RNFirebase } from 'react-native-firebase';

import { Loading, Stores, Types, Waves } from '../common';
import firebase from '../firebase';
import OceanStore from './OceanStore';

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

    const lastWave = waves.length > 0 && waves[waves.length - 1];
    const endAt = isMore && lastWave && lastWave.waveID || undefined;

    setLoadingWaves(true);

    const loadedWaves = await firebase.database.getWaves(
      { path: firebase.database.PathTypes.ocean, feeling: 'total' },
      endAt,
    );
    appendWaves(loadedWaves)

    if (loadedWaves.length === 0) {
      setLoadedAllWaves();
    }

    setLoadingWaves(false);
  }

  private subscribeOcean = async () => {
    await this.getOcean();

    // should get waves after getTimeline function call has been finished
    const { waves } = this.props.oceanStore;

    const firstWave = waves.length > 0 && waves[0];
    const startAt = firstWave && firstWave.waveID || undefined;

    firebase.database.subscribeWaves(
      { path: firebase.database.PathTypes.ocean, feeling: 'total' },
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

    if (waves.length === 0 && loadingWaves) {
      return <Loading />;
    }

    return (
      <View style={styles.container}>
        <Waves
          getMoreWaves={() => this.getOcean(true)}
          loadingWaves={loadingWaves}
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
