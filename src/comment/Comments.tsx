import { inject, observer } from 'mobx-react/native';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import { RNFirebase } from 'react-native-firebase';

import { Loading, Stores, Types, Wave } from '../common';
import firebase from '../firebase';
import { CommentsNavigationOptionsParams } from '../navigation/MainNavigation';
import { colors, typography } from '../styles';
import Comment from './Comment';
import CommentStore from './CommentStore';
import EmptyComments from './EmptyComments';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerContainer: {
    padding: 12,
  },
  input: {
    flex: 1,
  },
  inputButtonAndroid: {
    height: 37,
  },
  inputButtonIOS: {
    height: 30,
  },
  inputButtonContainer: {
    marginLeft: 0,
    marginRight: 0,
  },
  inputButtonText: {
    fontSize: typography.fontSizeMedium,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
});

interface CommentsInjectProps {
  commentStore: CommentStore;
  sessionUserUID: string;
}

interface CommentsOwnProps extends CommentsNavigationOptionsParams {}

type CommentsProps = CommentsInjectProps & CommentsOwnProps;

@observer
class Comments extends React.Component<CommentsProps> {
  private get buttonDisabled() {
    const { content, writing } = this.props.commentStore;

    return !content || writing;
  }

  private get comments() {
    const { commentsByWaveID } = this.props.commentStore;
    const { waveID } = this.props.navigation.state.params.wave;

    return commentsByWaveID.get(waveID) || [];
  }

  private getComments = async (isMore?: boolean) => {
    const {
      appendComments,
      loadedAllCommentsByWaveID,
      loadingCommentsByWaveID,
      setLoadedAllComments,
      setLoadingComments,
      commentsByWaveID,
    } = this.props.commentStore;
    const { waveID } = this.props.navigation.state.params.wave;

    const loadedAllComments = loadedAllCommentsByWaveID.get(waveID);
    const loadingComments = loadingCommentsByWaveID.get(waveID);

    if (loadedAllComments || loadingComments) {
      return;
    }

    setLoadingComments(waveID, true);

    const lastComment = this.comments.length > 0 && this.comments[this.comments.length - 1];
    const endAt = isMore && lastComment && lastComment.commentID || undefined;

    const loadedComments = await firebase.database.getComments(
      waveID,
      endAt,
    );

    appendComments(waveID, loadedComments);

    if (loadedComments.length === 0) {
      setLoadedAllComments(waveID);
    }

    setLoadingComments(waveID, false);
  }

  private keyExtractor = (comment: Types.Comment) => comment.commentID;

  private renderComment = ({ item }: ListRenderItemInfo<Types.Comment>) =>
    <Comment comment={item} />

  private renderFooter = () => {
    const { loadingCommentsByWaveID } = this.props.commentStore;
    const { waveID } = this.props.navigation.state.params.wave;

    const loadingComments = loadingCommentsByWaveID.get(waveID);

    if (!loadingComments) {
      return <View />;
    }

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  private renderHeader = () => {
    const { wave } = this.props.navigation.state.params;

    return (
      <Wave
        isInComments
        wave={wave}
      />
    );
  }

  private renderInput = () => {
    const { content, setContent, writing } = this.props.commentStore;

    const buttonStyle = Platform.select({
      android: styles.inputButtonAndroid,
      ios: styles.inputButtonIOS,
    });

    return (
      <View style={[styles.inputContainer, Platform.select({ ios: { paddingVertical: 6 } })]}>
        <TextInput
          onChangeText={setContent}
          placeholder="댓글을 남겨보세요."
          style={styles.input}
          value={content}
        />
        <Button
          backgroundColor={colors.lightBlue}
          borderRadius={1}
          buttonStyle={buttonStyle}
          containerViewStyle={styles.inputButtonContainer}
          disabled={this.buttonDisabled}
          onPress={this.write}
          textStyle={styles.inputButtonText}
          title="댓글"
        />
      </View>
    );
  }

  private subscribeComments = async () => {
    const { commentStore } = this.props;
    const { waveID } = this.props.navigation.state.params.wave;

    if (!commentStore.referenceCountOfCommentsByWaveID.get(waveID)) {
      await this.getComments();

      const firstComment = this.comments.length > 0 && this.comments[0];
      const startAt = firstComment && firstComment.commentID || undefined;

      firebase.database.subscribeComments(
        waveID,
        startAt,
        this.subscribeCommentsHandler,
      );
    }

    commentStore.increseReferenceCountOfComments(waveID);
  }

  private subscribeCommentsHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { waveID } = this.props.navigation.state.params.wave;
    const comment: Types.Comment = snapshot.val();

    this.props.commentStore.prependComment(waveID, comment);
  }

  private unsubscribeComments = () => {
    const { commentStore } = this.props;
    const { waveID } = this.props.navigation.state.params.wave;

    commentStore.decreseReferenceCountOfComments(waveID);

    if (!commentStore.referenceCountOfCommentsByWaveID.get(waveID)) {
      firebase.database.unsubscribeComments(
        waveID,
        this.subscribeCommentsHandler,
      );

      commentStore.deleteComments(waveID);
    }
  }

  private write = async () => {
    const { sessionUserUID } = this.props;
    const { content, setWriting } = this.props.commentStore;
    const { waveID } = this.props.navigation.state.params.wave;

    if (this.buttonDisabled || !content) {
      return;
    }

    setWriting(true);

    const comment: Types.CommentSpecification = {
      content,
      waveID,
    };

    await firebase.database.updateComment(sessionUserUID, comment);

    setWriting(false);
  }

  public componentDidMount() {
    this.subscribeComments();
  }

  public componentWillUnmount() {
    this.unsubscribeComments();
  }

  public render() {
    const { commentsByWaveID, loadingCommentsByWaveID } = this.props.commentStore;
    const { waveID } = this.props.navigation.state.params.wave;

    const loadingComments = loadingCommentsByWaveID.get(waveID);

    if (this.comments.length === 0 && loadingComments) {
      return <Loading />;
    }

    if (this.comments.length === 0) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding' as 'padding' })}
          keyboardVerticalOffset={64}
          style={styles.container}
        >
          {this.renderHeader()}
          <EmptyComments />
          {this.renderInput()}
        </KeyboardAvoidingView>
      );
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' as 'padding' })}
        keyboardVerticalOffset={64}
        style={styles.container}
      >
        <FlatList
          data={this.comments}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.renderHeader}
          onEndReached={() => this.getComments(true)}
          onEndReachedThreshold={1}
          refreshing={loadingComments}
          renderItem={this.renderComment}
          style={styles.container}
        />
        {this.renderInput()}
      </KeyboardAvoidingView>
    );
  }
}

export default inject<Stores, CommentsProps, CommentsInjectProps>(stores => ({
  commentStore: stores.commentStore,
  sessionUserUID: stores.sessionStore.user!.uid,
}))(observer(Comments));
