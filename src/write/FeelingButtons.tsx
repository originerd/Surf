import * as React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { Types } from '../common';
import FeelingButton from './FeelingButton';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: -2,
    marginVertical: 8,
  },
});

const FeelingButtons = () => (
  <View style={styles.container}>
    {
      Types.FeelingTypes.map(feeling =>
        <FeelingButton feeling={feeling} key={feeling} />,
      )
    }
  </View>
);

export default FeelingButtons;
