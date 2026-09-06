import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  // The web root has no explicit height by default, so our flex:1 app
  // shell collapses to its content height and the whole page scrolls
  // instead of just the wall/pulse list. Force the full chain to 100%.
  //
  // Use `100dvh` (dynamic viewport height) over plain `100%`/`100vh`: on
  // mobile Safari especially, opening the keyboard (e.g. the compose
  // sheet's name/status inputs) shrinks the *visual* viewport but not the
  // static one `100%`/`100vh` are based on, so the fixed-height app shell
  // stayed the same size while the browser tried to scroll the focused
  // input into view — the whole app appeared to grow past the screen.
  // `dvh` tracks the visual viewport directly. `100%` stays as a fallback
  // for the handful of older browsers without `dvh` support.
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root { height: 100%; }
    @supports (height: 100dvh) {
      html, body, #root { height: 100dvh; }
    }
  `;
  document.head.appendChild(style);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
