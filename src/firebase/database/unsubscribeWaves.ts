import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const unsubscribeWaves = async (path: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(path).orderByChild('createdAt').off('child_added', handler);
};
