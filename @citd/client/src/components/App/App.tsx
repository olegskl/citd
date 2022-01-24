import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { GameProvider } from '../../context/game';
import { SocketProvider } from '../../context/socket';
import { UserProvider } from '../../context/user';

import { ObserverPage } from '../ObserverPage';
import { PlayerPage } from '../PlayerPage';

export const App = (): React.ReactElement => (
  <SocketProvider address="ws://127.0.0.1:3000/sock">
    <GameProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/observer" component={ObserverPage} />
          <UserProvider>
            <Route path="/" component={PlayerPage} />
          </UserProvider>
        </Switch>
      </BrowserRouter>
    </GameProvider>
  </SocketProvider>
);
