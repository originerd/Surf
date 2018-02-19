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

  export namespace FBLoginManager {
    function loginWithPermissions(permissions: Permissions[], callback: (error: Error, data: { credentials: { token: string } }) => void): void;
    function logout(callback: (error: Error, data: { credentials: { token: string } }) => void): void;
  }
}
