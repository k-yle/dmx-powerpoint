import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home, Help, Settings } from 'routes';
import classes from './style/App.module.css';

export const App: React.FC = () => {
  return (
    <div className={classes.container}>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/help' component={Help} />
        <Route exact path='/settings' component={Settings} />
      </Switch>
    </div>
  );
};
