import { Feelings } from './feeling';

export interface WaveSpecification {
  content: string;
  feeling: Feelings;
}

export interface Wave extends WaveSpecification {
  createdAt: number;
  uid: string;
  waveID: string;
}
