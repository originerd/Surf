import { action, observable } from 'mobx';

class SympathyStore {
  @observable public sympathizedByWaveID: Map<string, boolean> = new Map();
  @observable public sympathyCountByWaveID: Map<string, number> = new Map();

  @action public setSympathized = (waveId: string, sympathized: boolean) => {
    this.sympathizedByWaveID.set(waveId, sympathized);
  }

  @action public setSympathyCount = (waveId: string, sympathyCount: number) => {
    this.sympathyCountByWaveID.set(waveId, sympathyCount);
  }
}

export default SympathyStore;
