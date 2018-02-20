import { FBLoginManager, FBLoginResponse } from 'react-native-facebook-login';
import { Permissions } from 'react-native-fbsdk';

export namespace Facebook {
  export const login = (permissions: Permissions[] = ['email']): Promise<FBLoginResponse> =>
    new Promise((resolve, reject) => {
      FBLoginManager.loginWithPermissions(permissions, (error, data) => {
        if (!error) {
          resolve(data);
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
}
