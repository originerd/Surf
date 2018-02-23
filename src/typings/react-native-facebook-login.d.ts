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

  export interface FBLoginResponseBase {
    declinedPermissions: Permissions[];
    provider: 'facebook';
    eventName: string;
    type: string;
    credentials: {
      permissions: Permissions[];
      tokenExpirationDate: string;
      userId: string;
      token: string;
    };
  }

  export interface FBLoginOriginalResponse extends FBLoginResponseBase {
    profile?: string;
  }

  export interface FBLoginResponse extends FBLoginResponseBase {
    profile: FBProfile;
  }

  export namespace FBLoginManager {
    function loginWithPermissions(permissions: Permissions[], callback: (error: Error, data: FBLoginOriginalResponse) => void): void;
    function logout(callback: (error: Error, data: { credentials: { token: string } }) => void): void;
  }
}
