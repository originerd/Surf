import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Stores, Types, Waves } from '../common';
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
  private subscribeTimeline = () => {
    const { oceanStore, user } = this.props;

    firebase.database.subscribeOcean(
      (snapshot) => {
        const wave: Types.Wave = snapshot.val();

        oceanStore.prependWave(wave);
      },
    );
  }

  public async componentWillMount() {
    this.subscribeTimeline();
  }

  public render() {
    const { waves } = this.props.oceanStore;

    return (
      <View style={styles.container}>
        <Waves waves={waves} />
      </View>
    );
  }
}

export default inject((stores: Stores): OceanInjectProps => ({
  oceanStore: stores.oceanStore,
  user: stores.sessionStore.user!,
}))(observer(Ocean));
