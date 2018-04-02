import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, GetWavePathParams } from './getPath';

export const unsubscribeWaves = async (pathParams: GetWavePathParams, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(getPath(pathParams)).orderByChild('createdAt').off('child_added', handler);
};
