import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet, Text, TextStyle, TouchableHighlight, ViewStyle } from 'react-native';

import { Stores, Types } from '../common';
import { feelingColors, typography } from '../styles';
import SympathyStore from '../sympathy/SympathyStore';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 1,
    justifyContent: 'center',
    paddingVertical: 4,
    width: 50,
  },
  feeling: {
    fontSize: typography.fontSizeSmall,
    fontWeight: 'bold',
  },
});

interface FeelingButtonInjectProps {
  sympathyStore: SympathyStore;
  uid: string;
}

interface FeelingButtonOwnProps {
  wave: Types.Wave;
}

type FeelingButtonProps = FeelingButtonInjectProps & FeelingButtonOwnProps;

class FeelingButton extends React.Component<FeelingButtonProps> {
  private get containerStyle() {
    const { feeling } = this.props.wave;

    let style: ViewStyle;

    if (this.sympathized) {
      style = { backgroundColor: feelingColors[feeling] };
    } else {
      style = {
        borderColor: feelingColors[feeling],
        borderWidth: 1,
      };
    }

    return [styles.container, style];
  }

  private get feelingStyle() {
    const { feeling } = this.props.wave;

    let style: TextStyle;

    if (this.sympathized) {
      style = { color: 'white' };
    } else {
      style = { color: feelingColors[feeling] };
    }

    return [styles.feeling, style];
  }

  private get sympathized() {
    const { sympathyStore, uid, wave } = this.props;

    return sympathyStore.sympathizedByWaveID.get(wave.waveID) || uid === wave.uid;
  }

  public render() {
    const { feeling } = this.props.wave;

    return (
      <TouchableHighlight style={this.containerStyle}>
        <Text style={this.feelingStyle}>
          {Types.Feelings[feeling]}
        </Text>
      </TouchableHighlight>
    );
  }
}

export default inject<Stores, FeelingButtonProps, FeelingButtonInjectProps>((stores) => ({
  sympathyStore: stores.sympathyStore,
  uid: stores.sessionStore.user!.uid,
}))(observer(FeelingButton));
