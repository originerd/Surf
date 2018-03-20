import {
  IReactComponent,
  IStoresToProps,
  IWrappedComponent,
} from 'mobx-react';

declare module 'mobx-react/native' {
  export function inject<S, P extends I, I>(
    fn: IStoresToProps<S, P, I>
  ): <T extends IReactComponent>(target: T) => IReactComponent<Omit<P, keyof I>> & IWrappedComponent<T>
  export function inject<S, P extends I, I, C>(
    fn: IStoresToProps<S, P, I, C>
  ): <T extends IReactComponent>(target: T) => IReactComponent<Omit<P, keyof I>> & IWrappedComponent<T>
}
