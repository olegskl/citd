import * as React from 'react';

import './PlayerPaused.css';

export const PlayerPaused: React.FC = () => (
  <div className="player-paused">
    <h1 className="text-glitchy-large">Code in the Dark</h1>
    <div className="text-glitchy-medium">Game is paused. Please wait.</div>
  </div>
);
