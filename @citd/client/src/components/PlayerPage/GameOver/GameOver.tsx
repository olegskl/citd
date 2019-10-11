import * as React from 'react';

import './GameOver.css';

export const GameOver: React.FC = () => (
  <div className='game-over'>
    <h1 className='text-glitchy-large'>Code in the Dark</h1>
    <div className='text-glitchy-medium'>Game over</div>
  </div>
);
