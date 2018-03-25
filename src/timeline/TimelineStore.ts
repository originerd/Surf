import { action, observable } from 'mobx';

import { Types }  from '../common';

class TimelineStore {
  @observable public waves: Types.Wave[] = [];

  @action public prependWave = (wave: Types.Wave) => {
    this.waves.unshift(wave);
  }
}

export default TimelineStore;
