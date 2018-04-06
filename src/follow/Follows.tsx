import { observer } from 'mobx-react/native';
import * as React from 'react';
import { FlatList, ListRenderItemInfo, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Loading, Types } from '../common';
import firebase from '../firebase';
import EmptyFollows from './EmptyFollows';
import Follow from './Follow';
import FollowStore from './FollowStore';

type GetFunction = typeof firebase.database.getFollowers | typeof firebase.database.getFollowings;

interface FollowOwnProps {
  navigation: NavigationScreenProp<
    {
      params: {
        type: Types.FollowTypes;
        uid: string;
      };
    },
    {}
  >;
}

type FollowProps = FollowOwnProps;

class Follows extends React.Component<FollowProps> {
  private followStore = new FollowStore();

  private getFollows = async (isMore?: boolean) => {
    const { uid, type } = this.props.navigation.state.params;
    const {
      appendFollows,
      loadedAllFollows,
      loadingFollows,
      setLoadedAllFollows,
      setLoadingFollows,
      follows,
    } = this.followStore;

    if (loadedAllFollows || loadingFollows) {
      return;
    }

    setLoadingFollows(true);

    const lastFollow = follows.length > 0 && follows[follows.length - 1];
    const endAt = isMore && lastFollow && lastFollow.createdAt || undefined;

    const loadedFollows = await this.getFunction(uid, endAt);

    appendFollows(loadedFollows);

    if (loadedFollows.length === 0) {
      setLoadedAllFollows();
    }

    setLoadingFollows(false);
  }

  private get getFunction(): GetFunction {
    const { type } = this.props.navigation.state.params;

    if (type === 'followers') {
      return firebase.database.getFollowers;
    }

    return firebase.database.getFollowings;
  }

  private keyExtractor = (item: Types.Follow) => item.uid;

  private renderFollow = ({ item }: ListRenderItemInfo<Types.Follow>) => <Follow follow={item} />;

  public componentDidMount() {
    this.getFollows();
  }

  public render() {
    const { type } = this.props.navigation.state.params;
    const { follows, loadingFollows } = this.followStore;

    if (follows.length === 0 && loadingFollows) {
      return <Loading />;
    }

    if (follows.length === 0) {
      return <EmptyFollows type={type} />;
    }

    return (
      <FlatList
        data={follows}
        keyExtractor={this.keyExtractor}
        onEndReached={() => this.getFollows(true)}
        onEndReachedThreshold={1}
        renderItem={this.renderFollow}
      />
    );
  }
}

export default observer(Follows);
