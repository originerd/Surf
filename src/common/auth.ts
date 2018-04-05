import { FBLoginManager, FBLoginResponse, FBProfile } from 'react-native-facebook-login';
import { Permissions } from 'react-native-fbsdk';

import * as Types from './types';

export namespace Facebook {
  const API_URL = 'https://graph.facebook.com/v2.12/me';
  const PROFILE_FIELDS = Types.FBProfileFields.join(',');

  export const login = (permissions: Permissions[] = ['email']): Promise<FBLoginResponse> =>
    new Promise((resolve, reject) => {
      FBLoginManager.loginWithPermissions(permissions, async (error, data) => {
        if (!error) {
          let profile: FBProfile;

          if (typeof data.profile === 'string') {
            profile = JSON.parse(data.profile);
          } else {
            profile = await getProfile(data.credentials.token);
          }

          const response: FBLoginResponse = {
            ...data,
            profile,
          };

          resolve(response);
        } else {
          reject(error);
        }
      });
    });

  export const logout = (): Promise<void> =>
    new Promise((resolve, reject) => {
      FBLoginManager.logout((error, data) => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      });
    });

  const getProfile = async (token: string): Promise<FBProfile> => {
    const url = `${API_URL}?fields=${PROFILE_FIELDS}&access_token=${token}`;
    const response = await fetch(url);
    const profile: FBProfile | { error: { message: string } } = await response.json();

    if ('error' in profile) {
      throw new Error(profile.error.message);
    }

    return profile;
  };
}
