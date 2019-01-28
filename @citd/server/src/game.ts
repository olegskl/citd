import { IGame } from '@citd/shared';

const game: IGame = {
  playerCount: 0,
  timeElapsed: 0,
  timeRemaining: 15 * 60 * 60,
  status: 'waitingForPlayers'
};

export function getGame() {
  return game;
}

export function startGame(): IGame {
  game.status = 'playing';
  return game;
}

export function pauseGame(): IGame {
  game.status = 'paused';
  return game;
}

export function unpauseGame(): IGame {
  game.status = 'playing';
  return game;
}

export function restartGame(): IGame {
  game.status = 'waitingForPlayers';
  game.timeElapsed = 0;
  return game;
}
