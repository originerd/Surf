import * as Types from '../../common/types';

export enum PathTypes {
  commentCounts = 'commentCounts',
  comments = 'comments',
  followers = 'followers',
  followings = 'followings',
  ocean = 'ocean',
  sympathies = 'sympathies',
  sympathyCounts = 'sympathyCounts',
  timeline = 'timeline',
  users = 'user',
  waveCounts = 'waveCounts',
  waves = 'waves',
}

export namespace GetPathParams {
  export interface CommentCounts {
    path: PathTypes.commentCounts;
    waveID: string;
  }

  export interface Comments {
    path: PathTypes.comments;
    waveID: string;
  }

  export interface Followers {
    path: PathTypes.followers;
    uid: string;
  }

  export interface Followings {
    path: PathTypes.followings;
    uid: string;
  }

  export interface Ocean {
    path: PathTypes.ocean;
    feeling: Types.FeelingFilterTypes;
  }

  export interface Ocean {
    path: PathTypes.ocean;
    feeling: Types.FeelingFilterTypes;
  }

  export interface Sympathies {
    path: PathTypes.sympathies;
    waveID: string;
  }

  export interface SympathyCounts {
    path: PathTypes.sympathyCounts;
    waveID: string;
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
    feeling: Types.FeelingFilterTypes;
  }

  export interface Waves {
    path: PathTypes.waves;
    uid: string;
    feeling: Types.FeelingFilterTypes;
  }
}

export type GetWavePathParams =
  GetPathParams.Ocean |
  GetPathParams.Timeline |
  GetPathParams.Waves;

export type GetPathParams =
  GetWavePathParams |
  GetPathParams.CommentCounts |
  GetPathParams.Comments |
  GetPathParams.Followers |
  GetPathParams.Followings |
  GetPathParams.Sympathies |
  GetPathParams.SympathyCounts |
  GetPathParams.Users |
  GetPathParams.WaveCounts;

export function getPath(params: GetPathParams): string {
  switch (params.path) {
    case PathTypes.commentCounts: {
      const { path, waveID } = params;

      return `${path}/${waveID}`;
    }
    case PathTypes.comments: {
      const { path, waveID } = params;

      return `${path}/${waveID}`;
    }
    case PathTypes.followers: {
      const { path, uid } = params;

      return `${path}/${uid}`;
    }
    case PathTypes.followings: {
      const { path, uid } = params;

      return `${path}/${uid}`;
    }
    case PathTypes.ocean: {
      const { feeling, path } = params;

      return `${path}/${feeling}`;
    }
    case PathTypes.sympathies: {
      const { path, waveID } = params;

      return `${path}/${waveID}`;
    }
    case PathTypes.sympathyCounts: {
      const { path, waveID } = params;

      return `${path}/${waveID}`;
    }
    case PathTypes.timeline: {
      const { path, uid } = params;

      return `${path}/${uid}`;
    }
    case PathTypes.users: {
      const { path, uid } = params;

      return `${path}/${uid}`;
    }
    case PathTypes.waveCounts: {
      const { feeling, path } = params;

      return `${path}/${feeling}`;
    }
    case PathTypes.waves: {
      const { feeling, path, uid } = params;

      return `${path}/${uid}/${feeling}`;
    }
    default:
      return '';
  }
}
