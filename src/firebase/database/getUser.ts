import firebase from 'react-native-firebase';

import * as Types from '../../types';

export const getUser = async (uid: string): Promise<Types.User> =>
  (await firebase.database().ref(`users/${uid}`).once("value")).val();
