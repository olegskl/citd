import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { SocketProvider } from '../../context/socket';

import { GameObserver } from '../GameObserver';
import { GamePlayer } from '../GamePlayer';

export const App: React.FC = () => (
  <SocketProvider>
    <BrowserRouter>
      <Switch>
        <Route path='/observer' component={GameObserver} />
        <Route path='/' component={GamePlayer} />
      </Switch>
    </BrowserRouter>
  </SocketProvider>
);
