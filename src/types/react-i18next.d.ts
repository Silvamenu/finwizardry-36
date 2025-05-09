
import 'react-i18next';
import React from 'react';

declare module 'react-i18next' {
  export type ReactI18NextChildren = React.ReactNode;
}

declare module 'react' {
  // Extend ReactNode to include ReactI18NextChildren
  interface ReactI18NextChildrenAsReactNode {
    children?: React.ReactNode;
  }
}
