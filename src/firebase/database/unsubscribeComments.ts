import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, GetPathParams, PathTypes } from './getPath';

export const unsubscribeComments = async (
  waveID: string,
  handler: (snapshot: RNFirebase.database.DataSnapshot) => void,
) => {
  firebase
    .database()
    .ref(getPath({ waveID, path: PathTypes.comments }))
    .orderByChild('createdAt')
    .off('child_added', handler);
};
