import { action, observable, IObservableArray } from 'mobx';

import { Types }  from '../common';

class TimelineStore {
  @observable public waves: IObservableArray<Types.Wave> = observable([]);

  @action public prependWave = (wave: Types.Wave) => {
    this.waves.unshift(wave);
  }
}

export default TimelineStore;