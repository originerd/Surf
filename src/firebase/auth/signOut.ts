import firebase from 'react-native-firebase';

export const signOut = (token: string) =>
  firebase.auth().signOut();
