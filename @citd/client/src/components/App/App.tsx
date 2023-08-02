import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GameProvider } from '../../context/game';
import { LoginPage } from '../../components/LoginPage';
import { ObserverPage } from '../../components/ObserverPage';
import { RulesPage } from '../../components/RulesPage';
import { WelcomePage } from '../../components/WelcomePage';
import { PlayerPage } from '../PlayerPage';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="rules" element={<RulesPage />} />
      <Route
        path="host"
        element={
          <GameProvider>
            <ObserverPage host />
          </GameProvider>
        }
      />
      <Route
        path="watch"
        element={
          <GameProvider>
            <ObserverPage />
          </GameProvider>
        }
      />
      <Route
        path="play"
        element={
          <GameProvider>
            <LoginPage>
              <PlayerPage />
            </LoginPage>
          </GameProvider>
        }
      />
    </Routes>
  </BrowserRouter>
);
