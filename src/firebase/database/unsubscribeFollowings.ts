import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const unsubscribeFollowings = (
  uid: string,
  handler: (snapshot: RNFirebase.database.DataSnapshot) => void,
) => {
  firebase.database().ref(getPath({ uid, path: PathTypes.followings })).on('value', handler);
};
