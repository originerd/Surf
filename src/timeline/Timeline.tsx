import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Stores, Types, Waves } from '../common';
import firebase from '../firebase';
import TimelineStore from './TimelineStore';
import { RNFirebase } from 'react-native-firebase';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
});

interface TimelineInjectProps {
  timelineStore: TimelineStore;
  user: Types.User;
}

type TimelineProps = TimelineInjectProps;

class Timeline extends React.Component<TimelineProps> {
  private getTimeline = async (isMore?: boolean) => {
    const { uid } = this.props.user;
    const {
      appendWaves,
      loadedAllWaves,
      loadingWaves,
      setLoadedAllWaves,
      setLoadingWaves,
      waves,
    } = this.props.timelineStore;

    if (loadedAllWaves || loadingWaves) {
      return;
    }

    const lastWave = waves[waves.length - 1];
    const endAt = isMore && lastWave && lastWave.waveID || undefined;

    setLoadingWaves(true);

    const loadedWaves = await firebase.database.getWaves(
      Types.getWavePath(Types.WavePathWithUIDTypes.timeline, uid),
      endAt,
    );
    appendWaves(loadedWaves)

    if (loadedWaves.length === 0) {
      setLoadedAllWaves();
    }

    setLoadingWaves(false);
  }

  private subscribeTimeline = async () => {
    const { timelineStore, user } = this.props;

    await this.getTimeline();

    const firstWave = timelineStore.waves[0];
    const startAt = firstWave && firstWave.waveID || undefined;

    firebase.database.subscribeWaves(
      Types.getWavePath(Types.WavePathWithUIDTypes.timeline, user.uid),
      startAt,
      this.subscribeTimelineHandler,
    );
  }

  private subscribeTimelineHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { timelineStore } = this.props;
    const wave: Types.Wave = snapshot.val();

    timelineStore.prependWave(wave);
  }

  public async componentDidMount() {
    this.subscribeTimeline();
  }

  public render() {
    const { loadingWaves, waves } = this.props.timelineStore;

    return (
      <View style={styles.container}>
        <Waves
          getMoreWaves={() => this.getTimeline(true)}
          isLoadingWaves={loadingWaves}
          waves={waves}
        />
      </View>
    );
  }
}

export default inject((stores: Stores): TimelineInjectProps => ({
  timelineStore: stores.timelineStore,
  user: stores.sessionStore.user!,
}))(observer(Timeline));
