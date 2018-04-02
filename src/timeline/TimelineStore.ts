import { action, observable } from 'mobx';

import { Types }  from '../common';

class TimelineStore {
  @observable public loadedAllWaves: boolean;
  @observable public loadingWaves: boolean;
  @observable public waves: Types.Wave[] = [];

  @action public appendWaves = (waves: Types.Wave[]) => {
    this.waves.push(...waves);
  }

  @action public prependWave = (wave: Types.Wave) => {
    this.waves.unshift(wave);
  }

  @action public setLoadedAllWaves = () => {
    this.loadedAllWaves = true;
  }

  @action public setLoadingWaves = (loadingWaves: boolean) => {
    this.loadingWaves = loadingWaves;
  }
}

export default TimelineStore;
