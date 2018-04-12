import firebase from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const updateWave = (uid: string, followerUIDs: string[], wave: Types.WaveSpecification) => {
  const now = Date.now();

  const waveID = firebase
    .database()
    .ref()
    .child(getPath({ path: PathTypes.ocean, feeling: 'total' }))
    .push()
    .key as string;

  const data: Types.Wave = {
    ...wave,
    uid,
    waveID,
    createdAt: now,
  };

  const { feeling } = data;

  const updates = {
    [`${getPath({ feeling, path: PathTypes.ocean })}/${waveID}`]: data,
    [`${getPath({ path: PathTypes.ocean, feeling: 'total' })}/${waveID}`]: data,
    [`${getPath({ waveID, path: PathTypes.sympathyCounts })}`]: 0,
    [`${getPath({ uid, path: PathTypes.timeline })}/${waveID}`]: data,
    [`${getPath({ feeling, uid, path: PathTypes.waves })}/${waveID}`]: data,
    [`${getPath({ uid, path: PathTypes.waves, feeling: 'total' })}/${waveID}`]: data,
  };

  followerUIDs.forEach((followerUID) => {
    updates[`${getPath({ path: PathTypes.timeline, uid: followerUID })}/${waveID}`] = data;
  });

  const updateWavePromise = firebase.database().ref().update(updates);
  const updateUserWaveCountsPromise = firebase
    .database()
    .ref(`${getPath({ uid, path: PathTypes.users })}/feelingCounts`)
    .transaction((feelingCounts: { [feelingType in Types.FeelingFilterTypes]?: number }) => ({
      ...feelingCounts,
      total: (feelingCounts.total || 0) + 1,
      [feeling]: (feelingCounts && feelingCounts[feeling] || 0) + 1,
    }));

  const updateWaveCountsFeelingPromise = firebase
    .database()
    .ref(getPath({ feeling, path: PathTypes.waveCounts }))
    .transaction(waveCount => (waveCount || 0) + 1);
  const updateWaveCountsTotalPromise = firebase
    .database()
    .ref(getPath({ path: PathTypes.waveCounts, feeling: 'total' }))
    .transaction(waveCount => (waveCount || 0) + 1);

  return Promise.all([
    updateUserWaveCountsPromise,
    updateWaveCountsFeelingPromise,
    updateWaveCountsTotalPromise,
    updateWavePromise,
  ]);
};
