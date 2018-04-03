import firebase from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const updateWave = (uid: string, followerUIDs: string[], wave: Types.WaveSpecification) => {
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
    [`${getPath({ path: PathTypes.ocean, feeling })}/${waveID}`]: data,
    [`${getPath({ path: PathTypes.ocean, feeling: 'total' })}/${waveID}`]: data,
    [`${getPath({ path: PathTypes.sympathyCounts, waveID })}`]: 0,
    [`${getPath({ path: PathTypes.timeline, uid })}/${waveID}`]: data,
    [`${getPath({ path: PathTypes.waves, uid, feeling })}/${waveID}`]: data,
    [`${getPath({ path: PathTypes.waves, uid, feeling: 'total' })}/${waveID}`]: data,
  };

  followerUIDs.forEach((followerUID) => {
    updates[`${getPath({ path: PathTypes.timeline, uid: followerUID })}/${waveID}`] = data;
  });

  const updateWavePromise = firebase.database().ref().update(updates);
  const updateUserWaveCountsPromise = firebase.database().ref(getPath({ path: PathTypes.users, uid})).transaction((user: Types.User) => {
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
  const updateWaveCountsFeelingPromise = firebase.database().ref(getPath({ path: PathTypes.waveCounts, feeling })).transaction((waveCount) => (waveCount || 0) + 1);
  const updateWaveCountsTotalPromise = firebase.database().ref(getPath({ path: PathTypes.waveCounts, feeling: 'total' })).transaction((waveCount) => (waveCount || 0) + 1);

  return Promise.all([
    updateUserWaveCountsPromise,
    updateWaveCountsFeelingPromise,
    updateWaveCountsTotalPromise,
    updateWavePromise,
  ]);
};
