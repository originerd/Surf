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

import { Stores, Types } from '../common';
import firebase from '../firebase';
import { colors, typography } from '../styles';
import SympathyStore from '../sympathy/SympathyStore';
import { getPlatformIconName } from './getPlatformIconName';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  sympathyCount: {
    color: 'gray',
    fontSize: typography.fontSizeSmall,
  },
});

interface SympathyInjectProps {
  sympathyStore: SympathyStore;
  uid: string;
}

interface SympathyOwnProps {
  waveID: string;
}

type SympathyProps = SympathyInjectProps & SympathyOwnProps;

class Sympathy extends React.Component<SympathyProps> {
  private subscribeSympathized = () => {
    const { sympathyStore, uid, waveID } = this.props;

    if (!sympathyStore.referenceCountOfSympathizedByWaveID.get(waveID)) {
      firebase.database.subscribeSympathized(waveID, uid, this.subscribeSympathizedHandler);
    }

    sympathyStore.increseReferenceCountOfSympathized(waveID);
  }

  private subscribeSympathizedHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { sympathyStore, waveID } = this.props;

    const sympathizedDate = snapshot.val();

    sympathyStore.setSympathized(waveID, !!sympathizedDate);
  }

  private subscribeSympathyCount = () => {
    const { sympathyStore, waveID } = this.props;

    if (!sympathyStore.referenceCountOfSympathyCountByWaveID.get(waveID)) {
      firebase.database.subscribeSympathyCount(waveID, this.subscribeSympathyCountHandler);
    }

    sympathyStore.increseReferenceCountOfSympathyCount(waveID);
  }

  private subscribeSympathyCountHandler = (snapshot: RNFirebase.database.DataSnapshot) => {
    const { sympathyStore, waveID } = this.props;

    const sympathyCount = snapshot.val();

    sympathyStore.setSympathyCount(waveID, sympathyCount);
  }

  private get sympathized() {
    const { sympathyStore, waveID } = this.props;

    return sympathyStore.sympathizedByWaveID.get(waveID);
  }

  private get sympathyCount() {
    const { sympathyStore, waveID } = this.props;

    return sympathyStore.sympathyCountByWaveID.get(waveID);
  }

  private unsubscribeSympathized = () => {
    const { sympathyStore, uid, waveID } = this.props;

    sympathyStore.decreseReferenceCountOfSympathized(waveID);

    if (!sympathyStore.referenceCountOfSympathizedByWaveID.get(waveID)) {
      firebase.database.unsubscribeSympathized(waveID, uid, this.subscribeSympathizedHandler);

      sympathyStore.deleteSympathized(waveID);
    }
  }

  private unsubscribeSympathyCount = () => {
    const { sympathyStore, waveID } = this.props;

    sympathyStore.decreseReferenceCountOfSympathyCount(waveID);

    if (!sympathyStore.referenceCountOfSympathyCountByWaveID.get(waveID)) {
      firebase.database.unsubscribeSympathyCount(waveID, this.subscribeSympathizedHandler);

      sympathyStore.deleteSympathized(waveID);
    }
  }

  public async componentDidMount() {
    this.subscribeSympathized();
    this.subscribeSympathyCount();
  }

  public componentWillUnmount() {
    this.unsubscribeSympathized();
    this.unsubscribeSympathyCount();
  }

  public render() {
    const { sympathized, sympathyCount } = this;

    if (sympathized === undefined || sympathyCount === undefined || sympathyCount === 0) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.sympathyCount}>
          공감 {sympathyCount.toLocaleString('en-US')}명
        </Text>
      </View>
    );
  }
}

export default inject<Stores, SympathyProps, SympathyInjectProps>((stores) => ({
  sympathyStore: stores.sympathyStore,
  uid: stores.sessionStore.user!.uid,
}))(observer(Sympathy));
