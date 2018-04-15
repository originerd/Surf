export interface CommentSpecification {
  content: string;
  waveID: string;
}

export interface Comment extends CommentSpecification {
  commentID: string;
  createdAt: number;
  uid: string;
}
