import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { GameProvider } from '../../context/game';
import { SocketProvider } from '../../context/socket';
import { UserProvider } from '../../context/user';

import { ObserverPage } from '../ObserverPage';
import { PlayerPage } from '../PlayerPage';

export const App: React.FC = () => (
  <SocketProvider>
    <UserProvider>
      <GameProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/observer" component={ObserverPage} />
            <Route path="/" component={PlayerPage} />
          </Switch>
        </BrowserRouter>
      </GameProvider>
    </UserProvider>
  </SocketProvider>
);
