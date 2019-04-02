import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { GameProvider } from '../../context/game';
import { SocketProvider } from '../../context/socket';
import { UserProvider } from '../../context/user';

import { GameObserver } from '../GameObserver';
import { GamePlayer } from '../GamePlayer';

export const App: React.FC = () => (
  <SocketProvider>
    <UserProvider>
      <GameProvider>
        <BrowserRouter>
          <Switch>
            <Route path='/observer' component={GameObserver} />
            <Route path='/' component={GamePlayer} />
          </Switch>
        </BrowserRouter>
      </GameProvider>
    </UserProvider>
  </SocketProvider>
);
