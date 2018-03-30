import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const subscribeFollowings = (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(`followings/${uid}`).on("value", handler);
};
