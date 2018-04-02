import { FeelingTypes } from './feeling';

export interface WaveSpecification {
  content?: string;
  feeling: FeelingTypes;
}

export interface Wave extends WaveSpecification {
  createdAt: number;
  uid: string;
  waveID: string;
}
