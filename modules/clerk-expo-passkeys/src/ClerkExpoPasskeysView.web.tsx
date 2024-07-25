import * as React from 'react';

import { ClerkExpoPasskeysViewProps } from './ClerkExpoPasskeys.types';

export default function ClerkExpoPasskeysView(props: ClerkExpoPasskeysViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
