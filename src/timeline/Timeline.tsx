import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Stores, Types, Waves } from '../common';
import firebase from '../firebase';
import TimelineStore from './TimelineStore';

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
  private subscribeTimeline = () => {
    const { timelineStore, user } = this.props;

    firebase.database.subscribeTimeline(
      user.uid,
      (snapshot) => {
        const wave: Types.Wave = snapshot.val();

        timelineStore.prependWave(wave);
      },
    );
  }

  public async componentWillMount() {
    this.subscribeTimeline();
  }

  public render() {
    const { waves } = this.props.timelineStore;

    return (
      <View style={styles.container}>
        <Waves waves={waves} />
      </View>
    );
  }
}

export default inject((stores: Stores): TimelineInjectProps => ({
  timelineStore: stores.timelineStore,
  user: stores.sessionStore.user!,
}))(observer(Timeline));
