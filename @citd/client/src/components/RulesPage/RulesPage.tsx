import * as React from 'react';
import { Link } from 'react-router-dom';

import './RulesPage.css';

export const RulesPage: React.VFC = () => (
  <div>
    <h1 className="text-glitchy-large">Rules of Coding in the Dark</h1>
    <div className="rule-list">
      <div className="text-readable">1. Do not switch away from the game tab.</div>
      <div className="text-readable">2. Do not look at the big screen behind you.</div>
      <div className="text-readable">3. Ask audience for help.</div>
      <div className="text-readable">4. Do not cheat!</div>
    </div>
    <div className="welcome-buttons">
      <Link to="/" className="button-glitchy-yellow">
        Back to home
      </Link>
      <Link to="/games" className="button-glitchy-yellow">
        Start playing
      </Link>
    </div>
  </div>
);
