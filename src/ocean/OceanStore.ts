import { action, observable } from 'mobx';

import { Types }  from '../common';

class OceanStore {
  @observable public waves: Types.Wave[] = [];

  @action public prependWave = (wave: Types.Wave) => {
    this.waves.unshift(wave);
  }
}

export default OceanStore;
