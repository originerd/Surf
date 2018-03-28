import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const subscribeUser = async (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(`users/${uid}`).on("value", handler);
};
