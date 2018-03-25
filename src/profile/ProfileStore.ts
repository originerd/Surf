import { action, observable } from 'mobx';

import { Types }  from '../common';

class ProfileStore {
  @observable public wavesByUID: Map<string, Types.Wave[]> = new Map();

  @action public prependWave = (uid: string, wave: Types.Wave) => {
    if (!this.wavesByUID.get(uid)) {
      this.wavesByUID.set(uid, []);
    }

    this.wavesByUID.get(uid)!.unshift(wave);
  }
}

export default ProfileStore;
