import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const subscribeWaves = async (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(`waves/${uid}`).orderByChild('createdAt').on('child_added', handler);
};
