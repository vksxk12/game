import React from 'react';

import { StackNavigator } from 'react-navigation';
import Drawer from 'react-native-drawer';
import { observer } from 'mobx-react';
import { View, StyleSheet } from 'react-native';

import Menu from './common/Menu';
import LoginScreen from './LoginScreen';

import InnerContainer from './InnerContainer';
import CombatScreen from './CombatScreen';

import HeroInfoModal from './HeroInfoModal';

import authStore from '../stores/auth';
import appStore from '../stores/app';

import startLogging from '../lib/mobx-logger';

startLogging();

const stackNavigatorConfig = {
  initialRouteName: 'Login',
  headerMode: 'none',
  cardStyle: { backgroundColor: 'transparent', shadowOpacity: 0 },
};

const Stack = StackNavigator(
  {
    Login: { screen: LoginScreen },
    Inner: { screen: InnerContainer, navigationOptions: { gesturesEnabled: false } },
    Combat: { screen: CombatScreen, navigationOptions: { gesturesEnabled: false } },
  },
  stackNavigatorConfig,
);

export const overlay = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'black',
  opacity: 0.5,
};

const styles = StyleSheet.create({
  overlay,
});

export default observer(() => {
  const heroInfo = appStore.showHeroInfoModal;

  return (
    <View style={{ flex: 1 }}>
      <Drawer
        type="static"
        ref={ref => appStore.setMenuRef(ref)}
        content={<Menu />}
        acceptDoubleTap
        openDrawerOffset={viewport => viewport.width - 80}
        panThreshold={0.08}
        panOpenMask={0.2}
        styles={{ drawer: { backgroundColor: '#1C1C1C' } }}
        disabled={!authStore.isLoggedIn}
        acceptPan={authStore.isLoggedIn}
      >
        <View style={{ backgroundColor: '#F2F2F2', flex: 1 }}>
          <Stack ref={ref => appStore.setNavigationRef(ref, 'outer')} />
        </View>
      </Drawer>
      {appStore.overlay && <View style={styles.overlay} />}
      {heroInfo && <HeroInfoModal warrior={heroInfo.warrior} isBot={heroInfo.isBot} />}
    </View>
  );
});
