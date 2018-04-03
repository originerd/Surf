import { FeelingTypes } from '../../common/types/feeling';

export enum PathTypes {
  followers = 'followers',
  followings = 'followings',
  ocean = 'ocean',
  sympathies = 'sympathies',
  sympathyCounts = 'sympathyCounts',
  timeline = 'timeline',
  users = 'user',
  waveCounts = 'waveCounts',
  waves ='waves',
}

export type FeelingFilterTypes = FeelingTypes | 'total';

export namespace GetPathParams {
  export interface Followers {
    path: PathTypes.followers;
    uid: string;
  };

  export interface Followings {
    path: PathTypes.followings;
    uid: string;
  };

  export interface Ocean {
    path: PathTypes.ocean;
    feeling: FeelingFilterTypes;
  };

  export interface Ocean {
    path: PathTypes.ocean;
    feeling: FeelingFilterTypes;
  };

  export interface Sympathies {
    path: PathTypes.sympathies;
  }

  export interface SympathyCounts {
    path: PathTypes.sympathyCounts;
  }

  export interface Timeline {
    path: PathTypes.timeline;
    uid: string;
  }

  export interface Users {
    path: PathTypes.users;
    uid: string;
  }

  export interface WaveCounts {
    path: PathTypes.waveCounts;
    feeling: FeelingFilterTypes;
  }

  export interface Waves {
    path: PathTypes.waves;
    uid: string;
    feeling: FeelingFilterTypes;
  }
}

export type GetWavePathParams =
  GetPathParams.Ocean |
  GetPathParams.Timeline |
  GetPathParams.Waves;

export type GetPathParams =
  GetWavePathParams |
  GetPathParams.Followers |
  GetPathParams.Followings |
  GetPathParams.Sympathies |
  GetPathParams.SympathyCounts |
  GetPathParams.Users |
  GetPathParams.WaveCounts;

export function getPath(params: GetPathParams): string {
  switch (params.path) {
    case PathTypes.followers: {
      const { uid, path } = params;

      return `${path}/${uid}`;
    }
    case PathTypes.followings: {
      const { uid, path } = params;

      return `${path}/${uid}`;
    }
    case PathTypes.ocean: {
      const { feeling, path } = params;

      return `${path}/${feeling}`;
    }
    case PathTypes.sympathies: {
      const { path } = params;

      return path;
    }
    case PathTypes.sympathyCounts: {
      const { path } = params;

      return path;
    }
    case PathTypes.timeline: {
      const { uid, path } = params;

      return `${path}/${uid}`;
    }
    case PathTypes.users: {
      const { uid, path } = params;

      return `${path}/${uid}`;
    }
    case PathTypes.waveCounts: {
      const { feeling, path } = params;

      return `${path}/${feeling}`;
    }
    case PathTypes.waves: {
      const { feeling, uid, path } = params;

      return `${path}/${uid}/${feeling}`;
    }
    default:
      return '';
  }
}
