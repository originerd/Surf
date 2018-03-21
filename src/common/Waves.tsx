import { observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Types } from '../common';
import Wave from './Wave';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
});

interface WavesProps {
  waves: Types.Wave[];
}

@observer
class Waves extends React.Component<WavesProps> {
  private renderWaves = () =>
    this.props.waves.map((wave) =>
      <Wave key={wave.waveID} wave={wave} />,
    );

  public render() {
    const { waves } = this.props;

    return (
      <View style={styles.container}>
        {this.renderWaves()}
      </View>
    );
  }
}

export default Waves;
