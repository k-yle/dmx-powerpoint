import React, { useState, createContext } from 'react';
import { HashRouter as Router } from 'react-router-dom';

type RootContextI = {
  needsRestart: boolean;
  setNeedsRestart: (v: boolean) => void;
};

// @ts-expect-error
export const RootContext = createContext<RootContextI>({});

const RootContextWrapper: React.FC = ({ children }) => {
  const [needsRestart, setNeedsRestart] = useState(false);
  return (
    <RootContext.Provider value={{ needsRestart, setNeedsRestart }}>
      {children}
    </RootContext.Provider>
  );
};

export const RootWrapper: React.FC = ({ children }) => (
  <React.StrictMode>
    <Router>
      <RootContextWrapper>{children}</RootContextWrapper>
    </Router>
  </React.StrictMode>
);
