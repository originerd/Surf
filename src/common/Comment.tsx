import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { RNFirebase } from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Ionicons';

import CommentStore from '../comment/CommentStore';
import { Stores, Types } from '../common';
import firebase from '../firebase';
import { colors, typography } from '../styles';
import { getPlatformIconName } from './getPlatformIconName';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  commentCount: {
    color: 'gray',
    fontSize: typography.fontSizeSmall,
    marginLeft: 6,
  },
});

interface CommentInjectProps {
  commentStore: CommentStore;
  sessionUserUID: string;
}

interface CommentOwnProps {
  waveID: string;
}

type CommentProps = CommentInjectProps & CommentOwnProps;

class Comment extends React.Component<CommentProps> {
  private subscribeCommentCount = () => {
    const { commentStore, waveID } = this.props;

    if (!commentStore.referenceCountOfCommentCountByWaveID.get(waveID)) {
      firebase.database.subscribeCommentCount(waveID, this.subscribeCommentCountHandler);
    }

    commentStore.increseReferenceCountOfCommentCount(waveID);
  }

  private subscribeCommentCountHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { commentStore, waveID } = this.props;

    const commentCount = snapshot.val();

    commentStore.setCommentCount(waveID, commentCount);
  }

  private get commentCount() {
    const { commentStore, waveID } = this.props;

    return commentStore.commentCountByWaveID.get(waveID);
  }

  private unsubscribeCommentCount = () => {
    const { commentStore, waveID } = this.props;

    commentStore.decreseReferenceCountOfCommentCount(waveID);

    if (!commentStore.referenceCountOfCommentCountByWaveID.get(waveID)) {
      firebase.database.unsubscribeCommentCount(waveID, this.subscribeCommentCountHandler);

      commentStore.deleteComments(waveID);
    }
  }

  public async componentDidMount() {
    this.subscribeCommentCount();
  }

  public componentWillUnmount() {
    this.unsubscribeCommentCount();
  }

  public render() {
    if (!this.commentCount) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.commentCount}>
          댓글 {this.commentCount.toLocaleString('en-US')}개
        </Text>
      </View>
    );
  }
}

export default inject<Stores, CommentProps, CommentInjectProps>(stores => ({
  commentStore: stores.commentStore,
  sessionUserUID: stores.sessionStore.user!.uid,
}))(observer(Comment));
