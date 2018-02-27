import { FBProfile } from 'react-native-facebook-login';

export interface User {
  email: string;
  name: string;
  profileImageURL: string;
  createdAt?: number;
  updatedAt?: number;
}

const sampleFBProfile: FBProfile = {
  id: '',
  name: '',
  email: '',
  first_name: '',
  last_name: '',
  link: '',
  picture: {
    data: {
      height: 0,
      is_silhouette: false,
      url: '',
      width: 0,
    },
  },
  gender: '',
  locale: '',
  timezone: 0,
  updated_time: '',
  verified: true,
};

export type FBProfileFields = keyof FBProfile;
export const FBProfileFields = Object.keys(sampleFBProfile) as FBProfileFields[];
