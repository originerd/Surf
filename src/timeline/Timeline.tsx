import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Loading, Stores, Types, Waves } from '../common';
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

    setLoadingWaves(true);

    const lastWave = waves.length > 0 && waves[waves.length - 1];
    const endAt = isMore && lastWave && lastWave.waveID || undefined;

    const loadedWaves = await firebase.database.getWaves(
      { uid, path: firebase.database.PathTypes.timeline },
      endAt,
    );
    appendWaves(loadedWaves);

    if (loadedWaves.length === 0) {
      setLoadedAllWaves();
    }

    setLoadingWaves(false);
  }

  private subscribeTimeline = async () => {
    const { uid } = this.props.user;

    await this.getTimeline();

    // should get waves after getTimeline function call has been finished
    const { waves } = this.props.timelineStore;

    const firstWave = waves.length > 0 && waves[0];
    const startAt = firstWave && firstWave.waveID || undefined;

    firebase.database.subscribeWaves(
      { uid, path: firebase.database.PathTypes.timeline },
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

    if (waves.length === 0 && loadingWaves) {
      return <Loading />;
    }

    return (
      <View style={styles.container}>
        <Waves
          getMoreWaves={() => this.getTimeline(true)}
          isSessionUsers
          loadingWaves={loadingWaves}
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
