import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const subscribeFeelings = async (feeling: Types.FeelingTypes, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref(`feelings/${feeling}`).orderByChild('createdAt').on('child_added', handler);
};
