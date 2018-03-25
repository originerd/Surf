import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const unsubscribeWaves = async (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(`waves/${uid}`).orderByChild('createdAt').off('child_added', handler);
};
