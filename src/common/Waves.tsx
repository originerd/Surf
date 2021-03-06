import { observer } from 'mobx-react/native';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';

import { Types } from '../common';
import { colors } from '../styles';
import EmptyWaves from './EmptyWaves';
import Wave from './Wave';
import WavesHeader from './WavesHeader';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  footerContainer: {
    padding: 12,
  },
  onHome: {
    paddingBottom: 80,
  },
});

interface WavesProps {
  getMoreWaves: () => void;
  isOnHome?: boolean;
  isSessionUsers: boolean;
  loadingWaves: boolean | undefined;
  uid?: string;
  waves: Types.Wave[];
}

@observer
class Waves extends React.Component<WavesProps> {
  private keyExtractor = (wave: Types.Wave) => wave.waveID;

  private renderFooter = () => {
    const { loadingWaves, uid } = this.props;

    if (!loadingWaves) {
      return <View />;
    }

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator color={colors.lightBlue} />
      </View>
    );
  }

  private renderHeader = () => {
    const { uid } = this.props;

    return <WavesHeader uid={uid} />;
  }

  private renderWave = ({ item }: ListRenderItemInfo<Types.Wave>) => <Wave wave={item} />;

  public render() {
    const { getMoreWaves, isOnHome, isSessionUsers, loadingWaves, waves } = this.props;

    if (waves.length === 0) {
      return (
        <View style={styles.container}>
          {this.renderHeader()}
          <EmptyWaves isSessionUsers={isSessionUsers} />
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={isOnHome ? styles.onHome : null}
        data={waves}
        keyExtractor={this.keyExtractor}
        ListFooterComponent={this.renderFooter}
        ListHeaderComponent={this.renderHeader}
        onEndReached={getMoreWaves}
        onEndReachedThreshold={1}
        refreshing={loadingWaves}
        renderItem={this.renderWave}
        style={styles.container}
      />
    );
  }
}

export default Waves;
