import React from 'react';
import ReactDOM from 'react-dom';
import { RootWrapper } from 'wrappers';
import { App } from './App';

// styles
import './style/loadTheme';
import './style/index.css';

ReactDOM.render(
  <RootWrapper>
    <App />
  </RootWrapper>,
  document.getElementById('root')
);
