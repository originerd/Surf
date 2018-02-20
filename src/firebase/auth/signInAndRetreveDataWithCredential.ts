import firebase from 'react-native-firebase';

export const signInAndRetrieveDataWithCredential = (token: string) =>
  firebase.auth().signInAndRetrieveDataWithCredential(
    firebase.auth.FacebookAuthProvider.credential(token),
  );
