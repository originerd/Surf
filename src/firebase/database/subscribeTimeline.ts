import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const subscribeTimeline = async (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(`timeline/${uid}`).orderByChild('createdAt').on('child_added', handler);
};
