import { action, observable } from 'mobx';

import { Types }  from '../common';

class ProfileStore {
  @observable public referenceCountsByUId: Map<string, number> = new Map();
  @observable public wavesByUID: Map<string, Types.Wave[]> = new Map();

  @action public appendWaves = (uid: string, waves: Types.Wave[]) => {
    if (!this.wavesByUID.get(uid)) {
      this.wavesByUID.set(uid, []);
    }

    this.wavesByUID.get(uid)!.push(...waves);
  }

  @action public decreseReferenceCount = (uid: string) => {
    const count = this.referenceCountsByUId.get(uid) || 0;

    this.referenceCountsByUId.set(uid, count - 1);
  }

  @action public deleteWaves = (uid: string) => {
    this.wavesByUID.delete(uid);
  }

  @action public increaseReferenceCount = (uid: string) => {
    const count = this.referenceCountsByUId.get(uid) || 0;

    this.referenceCountsByUId.set(uid, count + 1);
  }

  @action public prependWave = (uid: string, wave: Types.Wave) => {
    if (!this.wavesByUID.get(uid)) {
      this.wavesByUID.set(uid, []);
    }

    this.wavesByUID.get(uid)!.unshift(wave);
  }
}

export default ProfileStore;
