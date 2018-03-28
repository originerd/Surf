import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const unsubscribeUser = async (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(`users/${uid}`).off("value", handler);
};
