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
import FeelingButton from './FeelingButton';
import Sympathy from './Sympathy';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    display: 'flex',
    marginTop: 12,
    padding: 12,
  },
  content: {
    fontSize: typography.fontSizeMedium,
  },
  feeling: {
    color: 'whitesmoke',
    fontSize: typography.fontSizeSmall,
    fontWeight: 'bold',
  },
  feelingContainer: {
    alignItems: 'center',
    borderRadius: 1,
    justifyContent: 'center',
    paddingVertical: 4,
    width: 50,
  },
  footerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    borderRadius: 20,
    height: 24,
    overflow: 'hidden',
    width: 24,
  },
  profileName: {
    fontSize: typography.fontSizeMedium,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  publishedDate: {
    color: 'lightgray',
    fontSize: typography.fontSizeSmall,
  },
});

interface WaveInjectProps {
  navigationStore: NavigationStore;
  userStore: UserStore;
}

interface WaveOwnProps {
  isInComments?: boolean;
  wave: Types.Wave;
}

type WaveProps =
  WaveInjectProps &
  WaveOwnProps;

class Wave extends React.Component<WaveProps> {
  private navigateToComments = () => {
    const { isInComments, navigationStore, wave } = this.props;

    if (isInComments) {
      return;
    }

    navigationStore.mainNavigation.navigate('Comments', { wave });
  }

  private navigateToProfile = () => {
    const { navigationStore, wave } = this.props;
    const { uid } = wave;
    const userName = this.user && this.user.name;

    navigationStore.mainNavigation.navigate('Profile', { uid, userName });
  }

  private get publishedDate() {
    const { createdAt } = this.props.wave;
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
    const { userStore, wave } = this.props;

    return userStore.users.get(wave.uid);
  }

  public async componentDidMount() {
    const { userStore, wave } = this.props;

    if (!this.user) {
      const storedUser = await firebase.database.getUser(wave.uid);

      userStore.setUser(storedUser);
    }
  }

  public render() {
    const { wave } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.navigateToComments}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {this.renderProfile()}
            <FeelingButton wave={wave} />
          </View>
          <Text style={styles.content}>
            {wave.content}
          </Text>
          <View style={styles.footerContainer}>
            <Text style={styles.publishedDate}>
              {this.publishedDate}
            </Text>
            <Sympathy waveID={wave.waveID} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default inject<Stores, WaveProps, WaveInjectProps>(stores => ({
  navigationStore: stores.navigationStore,
  userStore: stores.userStore,
}))(observer(Wave));
