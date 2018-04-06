export interface Follow {
  createdAt: number;
  uid: string;
}

export enum FollowTypes {
  followers = 'followers',
  followings = 'followings',
}
