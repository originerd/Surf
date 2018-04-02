import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const subscribeUser = async (uid: string, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(getPath({ path: PathTypes.users, uid })).on("value", handler);
};
