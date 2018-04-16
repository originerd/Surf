import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Stores, Types } from '../common';
import { colors, feelingColors } from '../styles';
import { getPlatformIconName } from '../common/getPlatformIconName';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 2,
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 8,
  },
  contentContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 10,
    display: 'flex',
    height: 20,
    justifyContent: 'center',
    marginBottom: 4,
    width: 20,
  },
});

interface FeelingButtonInjectProps {
  selectedFeeling?: Types.FeelingTypes;
  setSelectedFeeling: (selectedFeeling: Types.FeelingTypes) => void;
}

interface FeelingButtonOwnProps {
  feeling: Types.FeelingTypes;
}

type FeelingButtonProps = FeelingButtonInjectProps & FeelingButtonOwnProps;

const FeelingButton = ({ feeling, selectedFeeling, setSelectedFeeling }: FeelingButtonProps) => {
  const isSelectedFeeling = selectedFeeling === feeling;
  const backgroundColor = isSelectedFeeling ? feelingColors[feeling] : '#EEEEEE';
  const color = isSelectedFeeling ? 'whitesmoke' : 'black';

  return (
    <TouchableHighlight
      onPress={() => setSelectedFeeling(feeling)}
      style={[styles.container, { backgroundColor }]}
      underlayColor="transparent"
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Icon
            color={isSelectedFeeling ? colors.blue : 'whitesmoke'}
            name={getPlatformIconName('checkmark')}
            size={16}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={{ color }}>
            {Types.Feelings[feeling]}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default inject<Stores, FeelingButtonProps, FeelingButtonInjectProps>(stores => ({
  selectedFeeling: stores.writeStore.feeling,
  setSelectedFeeling: stores.writeStore.setSelectedFeeling,
}))(observer(FeelingButton));
