import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ClerkExpoPasskeysViewProps } from './ClerkExpoPasskeys.types';

const NativeView: React.ComponentType<ClerkExpoPasskeysViewProps> =
  requireNativeViewManager('ClerkExpoPasskeys');

export default function ClerkExpoPasskeysView(props: ClerkExpoPasskeysViewProps) {
  return <NativeView {...props} />;
}
