import Toast from 'react-native-toast-message';

declare global {
  const toast: typeof Toast;
}

declare var toast: typeof Toast;
