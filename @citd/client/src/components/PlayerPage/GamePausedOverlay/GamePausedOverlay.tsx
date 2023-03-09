import * as React from 'react';

import './GamePausedOverlay.css';

export const GamePausedOverlay: React.VFC = () => (
  <div className="game-paused-overlay">
    <h1 className="text-glitchy-large">Code in the Dark</h1>
    <div className="text-glitchy-medium">Game is paused. Please wait.</div>
  </div>
);
