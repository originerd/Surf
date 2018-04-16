import { action, observable } from 'mobx';

import { Types } from '../common';

class CommentStore {
  @observable public commentsByWaveID: Map<string, Types.Comment[]> = new Map();
  @observable public commentCountByWaveID: Map<string, number> = new Map();
  @observable public content: string = '';
  @observable public loadedAllCommentsByWaveID: Map<string, boolean> = new Map();
  @observable public loadingCommentsByWaveID: Map<string, boolean> = new Map();
  @observable public referenceCountOfCommentCountByWaveID: Map<string, number> = new Map();
  @observable public referenceCountOfCommentsByWaveID: Map<string, number> = new Map();
  @observable public writing: boolean = false;

  @action public appendComments = (waveID: string, comments: Types.Comment[]) => {
    if (!this.commentsByWaveID.get(waveID)) {
      this.commentsByWaveID.set(waveID, []);
    }

    this.commentsByWaveID.get(waveID)!.push(...comments);
  }

  @action public decreseReferenceCountOfCommentCount = (waveID: string) => {
    const count = this.referenceCountOfCommentCountByWaveID.get(waveID) || 0;

    this.referenceCountOfCommentCountByWaveID.set(waveID, count - 1);
  }

  @action public decreseReferenceCountOfComments = (waveID: string) => {
    const count = this.referenceCountOfCommentsByWaveID.get(waveID) || 0;

    this.referenceCountOfCommentsByWaveID.set(waveID, count - 1);
  }

  @action public deleteComments = (waveID: string) => {
    this.commentsByWaveID.delete(waveID);
  }

  @action public increseReferenceCountOfCommentCount = (waveID: string) => {
    const count = this.referenceCountOfCommentCountByWaveID.get(waveID) || 0;

    this.referenceCountOfCommentCountByWaveID.set(waveID, count + 1);
  }

  @action public increseReferenceCountOfComments = (waveID: string) => {
    const count = this.referenceCountOfCommentsByWaveID.get(waveID) || 0;

    this.referenceCountOfCommentsByWaveID.set(waveID, count + 1);
  }

  @action public prependComment = (waveID: string, comment: Types.Comment) => {
    if (!this.commentsByWaveID.get(waveID)) {
      this.commentsByWaveID.set(waveID, []);
    }

    this.commentsByWaveID.get(waveID)!.unshift(comment);
  }

  @action public setCommentCount = (waveID: string, commentCount: number) => {
    this.commentCountByWaveID.set(waveID, commentCount);
  }

  @action public setContent = (content: string) => {
    this.content = content;
  }

  @action public setLoadedAllComments = (waveID: string) => {
    this.loadedAllCommentsByWaveID.set(waveID, true);
  }

  @action public setLoadingComments = (waveID: string, loadingComments: boolean) => {
    if (loadingComments) {
      this.loadingCommentsByWaveID.set(waveID, true);
    } else {
      this.loadingCommentsByWaveID.delete(waveID);
    }
  }

  @action public setWriting = (writing: boolean) => {
    this.writing = writing;
  }
}

export default CommentStore;
