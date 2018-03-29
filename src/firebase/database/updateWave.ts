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

  const { feeling } = data;

  const updates = {
    [`feelings/${feeling}/${waveID}`]: data,
    [`ocean/${waveID}`]: data,
    [`sympathyCounts/${waveID}`]: 0,
    [`timeline/${uid}/${waveID}`]: data,
    [`waves/${uid}/${waveID}`]: data,
  };

  const updateWavePromise = firebase.database().ref().update(updates);
  const updateUserWaveCountsPromise = firebase.database().ref(`users/${uid}`).transaction((user: Types.User) => {
    const { feelingCounts } = user;

    return {
      ...user,
      feelingCounts: {
        ...feelingCounts,
        [feeling]: (feelingCounts && feelingCounts[feeling] || 0) + 1,
      },
      waveCount: user.waveCount + 1,
    };
  });
  const updateWaveCountsTotalPromise = firebase.database().ref("waveCounts/total").transaction((waveCount) => (waveCount || 0) + 1);
  const updateWaveCountsFeelingPromise = firebase.database().ref(`waveCounts/${feeling}`).transaction((waveCount) => (waveCount || 0) + 1);

  return Promise.all([
    updateUserWaveCountsPromise,
    updateWaveCountsFeelingPromise,
    updateWaveCountsTotalPromise,
    updateWavePromise,
  ]);
};
