import firebase from 'react-native-firebase';

import { Types } from '../../common';

export const updateWave = (uid: string, wave: Types.WaveSpecification) => {
  const now = Date.now();

  const waveID = firebase.database().ref().child('waves').push().key as string;

  const data: Types.Wave = {
    ...wave,
    createdAt: now,
    uid,
    waveID,
  };

  const updates = {
    [`feelings/${data.feeling}/${waveID}`]: data,
    [`likeCounts/${waveID}`]: 0,
    [`ocean/${waveID}`]: data,
    [`timeline/${uid}/${waveID}`]: data,
    [`waves/${uid}/${waveID}`]: data,
  };

  const updateWavePromise = firebase.database().ref().update(updates);
  const updateUserWaveCountPromise = firebase.database().ref(`users/${uid}/waveCount`).transaction((waveCount) => waveCount + 1);
  const updateWaveCountsTotalPromise = firebase.database().ref("waveCounts/total").transaction((waveCount) => (waveCount || 0) + 1);
  const updateWaveCountsFeelingPromise = firebase.database().ref(`waveCounts/${data.feeling}`).transaction((waveCount) => (waveCount || 0) + 1);

  return Promise.all([
    updateUserWaveCountPromise,
    updateWaveCountsFeelingPromise,
    updateWaveCountsTotalPromise,
    updateWavePromise,
  ]);
};
