import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProp } from 'react-navigation';

import { Stores, Types } from '../common';
import firebase from '../firebase';
import SessionStore from '../session/SessonStore';
import { colors, typography } from '../styles';
import FeelingButtons from './FeelingButtons';
import WriteStore from './WriteStore';

const styles = StyleSheet.create({
  buttonContainer: {
    marginLeft: 0,
    marginRight: 0,
  },
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
  sessionStore: SessionStore;
  writeStore: WriteStore;
}

interface WriteOwnProps {
  navigation: NavigationScreenProp<{}, {}>;
}

type WriteProps = WriteInjectProps & WriteOwnProps;

class Write extends React.Component<WriteProps> {
  private get buttonDisabled() {
    const { hasFollowerUIDsLoaded } = this.props.sessionStore;
    const { content, feeling, writing } = this.props.writeStore;

    return !hasFollowerUIDsLoaded || !content || content.length === 0 || !feeling || writing;
  }

  private get user() {
    return this.props.sessionStore.user!;
  }

  private write = async () => {
    const { navigation, sessionStore, writeStore } = this.props;

    const { followerUIDs } = sessionStore;
    const { content, feeling, setWriting, writing } = writeStore;

    if (this.buttonDisabled || !content || !feeling) {
      return;
    }

    setWriting(true);

    try {
      await firebase.database.updateWave(
        this.user.uid,
        followerUIDs,
        { content, feeling },
      );

      writeStore.reset();

      navigation.goBack();
    } catch {
      // do nothing
    } finally {
      setWriting(false);
    }
  }

  public render() {
    const { sessionStore, writeStore } = this.props;

    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' as 'padding' })}
        keyboardVerticalOffset={64}
        style={styles.container}
      >
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: this.user.profileImageURL }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{this.user.name}</Text>
        </View>
        <FeelingButtons />
        <TextInput
          multiline
          onChangeText={writeStore.setContent}
          placeholder="파도를 만들어주세요"
          selectionColor={colors.lightBlue}
          style={styles.textInput}
          value={writeStore.content}
          underlineColorAndroid={colors.lightBlue}
        />
        <Button
          backgroundColor={colors.lightBlue}
          borderRadius={2}
          containerViewStyle={[
            styles.buttonContainer,
            Platform.select({ ios: { marginBottom: 16 } }),
          ]}
          disabled={this.buttonDisabled}
          onPress={this.write}
          title="파도만들기"
        />
      </KeyboardAvoidingView>
    );
  }
}

export default inject((stores: Stores): WriteInjectProps => ({
  sessionStore: stores.sessionStore,
  writeStore: stores.writeStore,
}))(observer(Write));
