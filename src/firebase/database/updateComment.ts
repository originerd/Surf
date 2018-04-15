import firebase from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const updateComment = (uid: string, comment: Types.CommentSpecification) => {
  const now = Date.now();

  const commentPath = getPath({ path: PathTypes.comments, waveID: comment.waveID });

  const commentID = firebase
    .database()
    .ref()
    .child(commentPath)
    .push()
    .key as string;

  const data: Types.Comment = {
    ...comment,
    commentID,
    uid,
    createdAt: now,
  };

  const updates = {
    [`${commentPath}/${commentID}`]: data,
  };

  const updateCommentPromise = firebase.database().ref().update(updates);

  const updateCommentCountsPromise = firebase
    .database()
    .ref(getPath({ path: PathTypes.commentCounts, waveID: comment.waveID }))
    .transaction(commentCount => (commentCount || 0) + 1);

  return Promise.all([
    updateCommentCountsPromise,
    updateCommentPromise,
  ]);
};
