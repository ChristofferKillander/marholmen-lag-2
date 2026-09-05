import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  // The web root has no explicit height by default, so our flex:1 app
  // shell collapses to its content height and the whole page scrolls
  // instead of just the wall/pulse list. Force the full chain to 100%.
  const style = document.createElement('style');
  style.textContent = `html, body, #root { height: 100%; }`;
  document.head.appendChild(style);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
