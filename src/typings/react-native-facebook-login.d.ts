declare module 'react-native-facebook-login' {
  import * as React from 'react';
  import { ViewStyle } from 'react-native';
  import { Permissions } from 'react-native-fbsdk';

  export interface FBLoginProps {
    style?: ViewStyle;
    permissions: Permissions[];
    loginBehavior?: number;
    onLogin?: (user: object) => void;
    onLogout?: () => void;
    onLoginFound?: (user: object) => void;
    onLoginNotFound?: () => void;
    onError?: (error: Error) => void;
    onCancel?: () => void;
    onPermissionsMissing?: (error: Error) => void;
  }

  export class FBLogin extends React.Component<FBLoginProps> {}

  export interface FBProfile {
    id: string;
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    link: string;
    user_id: string;
    picture: {
      data: {
        height: number;
        is_silhouette: boolean;
        url: string;
        width: number;
      };
    };
    gender: string;
    locale: string;
    timezone: number;
    updated_time: string;
    verified: boolean;
  }

  export interface FBLoginResponse {
    declinedPermissions: Permissions[];
    provider: 'facebook';
    eventName: string;
    profile: FBProfile;
    type: string;
    credentials: {
      permissions: Permissions[];
      tokenExpirationDate: string;
      userId: string;
      token: string;
    };
  }

  export namespace FBLoginManager {
    function loginWithPermissions(permissions: Permissions[], callback: (error: Error, data: FBLoginResponse) => void): void;
    function logout(callback: (error: Error, data: { credentials: { token: string } }) => void): void;
  }
}
