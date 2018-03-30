import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const unsubscribeFollowers = (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(`followers/${uid}`).on("value", handler);
};
