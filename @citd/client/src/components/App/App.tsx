import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { GameProvider } from '../../context/game';
import { LoginPage } from '../../components/LoginPage';
import { ObserverPage } from '../../components/ObserverPage';
import { RulesPage } from '../../components/RulesPage';
import { WelcomePage } from '../../components/WelcomePage';
import { PlayerPage } from '../PlayerPage';

export const App: React.VFC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={() => <WelcomePage />} />
      <Route path="/rules" exact render={() => <RulesPage />} />
      <Route
        path="/host"
        exact
        render={() => (
          <GameProvider>
            <ObserverPage host />
          </GameProvider>
        )}
      />
      <Route
        path="/watch"
        exact
        render={() => (
          <GameProvider>
            <ObserverPage />
          </GameProvider>
        )}
      />
      <Route
        path="/play"
        exact
        render={() => (
          <GameProvider>
            <LoginPage>
              <PlayerPage />
            </LoginPage>
          </GameProvider>
        )}
      />
    </Switch>
  </BrowserRouter>
);
