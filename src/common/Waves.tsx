import { observer } from 'mobx-react/native';
import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native';

import { Types } from '../common';
import EmptyWaves from './EmptyWaves';
import Wave from './Wave';
import WavesHeader from './WavesHeader';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
});

interface WavesProps {
  uid?: string;
  waves: Types.Wave[];
}

@observer
class Waves extends React.Component<WavesProps> {
  private keyExtractor = (wave: Types.Wave) => wave.waveID

  private renderHeader = () => {
    const { uid } = this.props;

    return <WavesHeader uid={uid} />;
  }

  private renderWave = ({ item }: ListRenderItemInfo<Types.Wave>) => <Wave wave={item} />

  public render() {
    const { waves } = this.props;

    if (waves.length === 0) {
      return <EmptyWaves />;
    }

    return (
      <FlatList
        data={waves}
        keyExtractor={this.keyExtractor}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderWave}
        style={styles.container}
      />
    );
  }
}

export default Waves;
