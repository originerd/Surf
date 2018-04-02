import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import { colors, typography } from '../styles';
import { Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    display: 'flex',
    flex: 1,
  },
  description: {
    color: 'whitesmoke',
  },
  descriptionContainer: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    height: 80,
    width: 80,
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 3,
    justifyContent: 'center',
  },
  title: {
    color: colors.yellow,
    fontSize: typography.fontSizeLarge,
  },
});

const SplashScreen = () => (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image source={require('../../src/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>
        Surf
      </Text>
    </View>
    <View style={styles.descriptionContainer}>
      <Text style={styles.description}>
        Share your feelings
      </Text>
    </View>
  </View>
);

export default SplashScreen;
