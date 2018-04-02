import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const subscribeFollowers = (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(getPath({ path: PathTypes.followers, uid})).on("value", handler);
};
