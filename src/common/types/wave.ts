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

export enum WavePathWithUIDTypes {
  timeline = 'timeline',
  waves ='waves',
}

export enum WavePathWithoutUIDTypes {
  feelings = 'feelings',
  ocean = 'ocean',
}

type GetWaveWithUIDPath = (wavePath: WavePathWithUIDTypes, uid: string) => string;
type GetWaveWithoutUIDPath = (wavePath: WavePathWithoutUIDTypes) => string;
type GetWavePath = GetWaveWithUIDPath | GetWaveWithoutUIDPath;

export function getWavePath(wavePath: WavePathWithUIDTypes, uid: string): string;
export function getWavePath(wavePath: WavePathWithoutUIDTypes): string;
export function getWavePath(...args: any[]): string {
  if (args.length === 1) {
    return args[0];
  }

  return args.join('/');
}
