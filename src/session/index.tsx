import * as React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { auth, EmotionColorsLine, firebase } from '../common';
import { colors, typography } from '../styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    display: 'flex',
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    paddingVertical: 30,
  },
  loginButtonContainer: {
    marginVertical: 1,
  },
  subTitle: {
    color: 'whitesmoke',
    fontSize: typography.fontSizeMedium,
  },
  title: {
    color: 'white',
    fontSize: typography.fontSizeLarge,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

class Session extends React.Component {
  private signInWithFacebook = async () => {
    try {
      const token = await auth.Facebook.login();

      firebase.auth().signInAndRetrieveDataWithCredential(
        firebase.auth.FacebookAuthProvider.credential(token),
      );
    } catch (error) {
      // handle error
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            감정을 나눠요
          </Text>
          <Text style={styles.subTitle}>
            당신의 이야기가 듣고 싶어요!
          </Text>
        </View>
        <EmotionColorsLine />
        <View>
          <View style={styles.loginButtonContainer}>
            <Button
              color={colors.facebook}
              onPress={this.signInWithFacebook}
              title="페이스북으로 시작하기"
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Session;
