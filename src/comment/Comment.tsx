import { inject, observer } from 'mobx-react/native';
import * as moment from 'moment';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Stores, Types } from '../common';
import firebase from '../firebase';
import NavigationStore from '../navigation/NavigationStore';
import { colors, feelingColors, typography } from '../styles';
import UserStore from '../user/UserStore';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    display: 'flex',
    marginTop: 6,
    padding: 12,
    paddingLeft: 24,
  },
  content: {
    fontSize: typography.fontSizeMedium,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileImage: {
    flex: 1,
  },
  profileImageContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 9,
    height: 18,
    overflow: 'hidden',
    width: 18,
  },
  profileName: {
    fontSize: typography.fontSizeMedium,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  publishedDate: {
    color: 'lightgray',
    fontSize: typography.fontSizeSmall,
  },
});

interface CommentInjectProps {
  navigationStore: NavigationStore;
  userStore: UserStore;
}

interface CommnetOwnProps {
  comment: Types.Comment;
}

type CommentProps =
  CommentInjectProps &
  CommnetOwnProps;

class Comment extends React.Component<CommentProps> {
  private navigateToProfile = () => {
    const { comment, navigationStore } = this.props;
    const { uid } = comment;
    const userName = this.user && this.user.name;

    navigationStore.mainNavigation.navigate('Profile', { uid, userName });
  }

  private get publishedDate() {
    const { createdAt } = this.props.comment;
    const publishedDate = moment(createdAt);
    const now = moment();

    // if the published date is within a day
    if (publishedDate.clone().add(1, 'day').isAfter(now)) {
      return publishedDate.fromNow();
    }

    return publishedDate.format('lll');
  }

  private renderProfile = () => {
    const userName = this.user && this.user.name;

    return (
      <TouchableWithoutFeedback onPress={this.navigateToProfile}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            {this.renderProfileImage()}
          </View>
          <Text style={styles.profileName}>
            {userName}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  private renderProfileImage = () => {
    if (!this.user) {
      return null;
    }

    return <Image source={{ uri: this.user.profileImageURL }} style={styles.profileImage} />;
  }

  private get user() {
    const { comment, userStore } = this.props;

    return userStore.users.get(comment.uid);
  }

  public async componentDidMount() {
    const { comment, userStore } = this.props;

    if (!this.user) {
      const storedUser = await firebase.database.getUser(comment.uid);

      userStore.setUser(storedUser);
    }
  }

  public render() {
    const { comment } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {this.renderProfile()}
          <Text style={styles.publishedDate}>
            {this.publishedDate}
          </Text>
        </View>
        <Text style={styles.content}>
          {comment.content}
        </Text>
      </View>
    );
  }
}

export default inject<Stores, CommentProps, CommentInjectProps>(stores => ({
  navigationStore: stores.navigationStore,
  userStore: stores.userStore,
}))(observer(Comment));
