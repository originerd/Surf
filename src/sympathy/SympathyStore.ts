import { action, observable } from 'mobx';

class SympathyStore {
  @observable public referenceCountOfSympathizedByWaveID: Map<string, number> = new Map();
  @observable public referenceCountOfSympathyCountByWaveID: Map<string, number> = new Map();
  @observable public sympathizedByWaveID: Map<string, boolean> = new Map();
  @observable public sympathyCountByWaveID: Map<string, number> = new Map();

  @action public decreseReferenceCountOfSympathized = (waveID: string) => {
    const count = this.referenceCountOfSympathizedByWaveID.get(waveID) || 0;

    this.referenceCountOfSympathizedByWaveID.set(waveID, count - 1);
  }

  @action public decreseReferenceCountOfSympathyCount = (waveID: string) => {
    const count = this.referenceCountOfSympathyCountByWaveID.get(waveID) || 0;

    this.referenceCountOfSympathyCountByWaveID.set(waveID, count - 1);
  }

  @action public deleteSympathized = (waveID: string) => {
    this.sympathizedByWaveID.delete(waveID);
  }

  @action public deleteSympathyCount = (waveID: string) => {
    this.sympathyCountByWaveID.delete(waveID);
  }

  @action public increseReferenceCountOfSympathized = (waveID: string) => {
    const count = this.referenceCountOfSympathizedByWaveID.get(waveID) || 0;

    this.referenceCountOfSympathizedByWaveID.set(waveID, count + 1);
  }

  @action public increseReferenceCountOfSympathyCount = (waveID: string) => {
    const count = this.referenceCountOfSympathyCountByWaveID.get(waveID) || 0;

    this.referenceCountOfSympathyCountByWaveID.set(waveID, count + 1);
  }

  @action public setSympathized = (waveID: string, sympathized: boolean) => {
    this.sympathizedByWaveID.set(waveID, sympathized);
  }

  @action public setSympathyCount = (waveID: string, sympathyCount: number) => {
    this.sympathyCountByWaveID.set(waveID, sympathyCount);
  }
}

export default SympathyStore;
