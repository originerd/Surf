import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SocialIcon } from 'react-native-elements';

import { auth, FeelingColorsLine, Types } from '../common';
import firebase from '../firebase';
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
    color: 'whitesmoke',
    fontSize: typography.fontSizeLarge,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

class Session extends React.Component {
  private signInWithFacebook = async () => {
    try {
      const response = await auth.Facebook.login();

      await firebase.auth.signInAndRetrieveDataWithCredential(response.credentials.token);

      const currentUser = firebase.auth.getCurrentUser();
      if (!currentUser) {
        return;
      }

      const { uid } = currentUser;
      const { email, name } = response.profile;
      const profileImageURL =
        `https://graph.facebook.com/${response.profile.id}/picture?type=large`;

      const user: Types.UserSpecification = {
        email,
        name,
        profileImageURL,
        uid,
      };

      await firebase.database.updateUser(uid, user);
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
        <FeelingColorsLine />
        <View>
          <View style={styles.loginButtonContainer}>
            <SocialIcon
              button
              onPress={this.signInWithFacebook}
              title="페이스북으로 시작하기"
              type="facebook"
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Session;
