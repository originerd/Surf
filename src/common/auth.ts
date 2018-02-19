import { FBLoginManager } from 'react-native-facebook-login';
import { Permissions } from 'react-native-fbsdk';

export namespace Facebook {
  export const login = (permissions: Permissions[] = ['email']): Promise<string> =>
    new Promise((resolve, reject) => {
      FBLoginManager.loginWithPermissions(permissions, (error, data) => {
        if (!error) {
          resolve(data.credentials.token);
        } else {
          reject(error);
        }
      });
    });

  export const logout = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      FBLoginManager.logout((error, data) => {
        if (!error) {
          resolve(true);
        } else {
          reject(error);
        }
      });
    });
}
