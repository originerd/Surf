import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Stores, Types } from '../common';
import firebase from '../firebase';
import { colors, typography } from '../styles';
import FeelingButtons from './FeelingButtons';
import WriteStore from './WriteStore';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  profileImage: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  profileName: {
    fontSize: typography.fontSizeMedium,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  textInput: {
    flex: 1,
    fontSize: typography.fontSizeMedium,
    textAlignVertical: 'top',
  },
});

interface WriteInjectProps {
  user: Types.User;
  writeStore: WriteStore;
}

interface WriteOwnProps {
  navigation: NavigationScreenProp<{}, {}>;
}

type WriteProps = WriteInjectProps & WriteOwnProps;

class Write extends React.Component<WriteProps> {
  private write = async () => {
    const { navigation, user, writeStore } = this.props;

    const { content, feeling } = writeStore;

    if (!feeling) {
      return;
    }

    try {
      await firebase.database.updateWave(user.uid, { content, feeling });

      writeStore.reset();

      navigation.goBack();
    } catch {
      // do nothing
    }
  }

  public render() {
    const { user, writeStore } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: user.profileImageURL }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user.name}</Text>
        </View>
        <FeelingButtons />
        <TextInput
          multiline
          onChangeText={writeStore.setContent}
          placeholder="파도를 만들어주세요"
          style={styles.textInput}
          value={writeStore.content}
        />
        <Button
          color="black"
          disabled={!writeStore.feeling}
          onPress={this.write}
          title="파도만들기"
        />
      </View>
    );
  }
}

export default inject((stores: Stores): WriteInjectProps => ({
  user: stores.sessionStore.user!,
  writeStore: stores.writeStore,
}))(observer(Write));
