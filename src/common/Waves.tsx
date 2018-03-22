import { observer } from 'mobx-react/native';
import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native';

import { Types } from '../common';
import Wave from './Wave';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 8,
  },
});

interface WavesProps {
  waves: Types.Wave[];
}

@observer
class Waves extends React.Component<WavesProps> {
  private keyExtractor = (wave: Types.Wave) => wave.waveID

  private renderWave = ({ item }: ListRenderItemInfo<Types.Wave>) => <Wave wave={item} />

  public render() {
    const { waves } = this.props;

    return (
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={waves}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderWave}
        style={styles.container}
      />
    );
  }
}

export default Waves;
