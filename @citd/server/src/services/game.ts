import { Game } from '@citd/shared';
import * as fs from 'fs';
import * as path from 'path';

import { findUser } from './users';
import { applyOperation, clearPlayerTimeline, getPlayerTimeline } from './timelines';

type GameTickCallback = (game: Game) => void;

const callbacks: GameTickCallback[] = [];

function initializeGame(): Game {
  return {
    status: 'waiting',
    timeRemaining: 15 * 60,
    players: []
  };
}

let tickTimer: NodeJS.Timeout;
let game = initializeGame();

export function onGameTick(callback: GameTickCallback) {
  callbacks.push(callback);
}

export function offGameTick(callback: GameTickCallback) {
  const index = callbacks.indexOf(callback);
  callbacks.splice(index, 1);
}

export function getGame(): Game {
  return game;
}

export function startGame(): Game {
  game.status = 'playing';
  clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    game.timeRemaining -= 1;
    if (game.timeRemaining < 0) {
      endGame();
    }
    callbacks.forEach(callback => callback(game));
  }, 1000);
  return game;
}

export function pauseGame(): Game {
  game.status = 'paused';
  clearInterval(tickTimer);
  return game;
}

export function endGame(): Game {
  game.status = 'ended';
  game.timeRemaining = 0;
  clearInterval(tickTimer);
  callbacks.forEach(callback => callback(game));
  fs.mkdir(path.resolve('../tmp'), mkdirError => {
    if (mkdirError) {
      console.error(mkdirError);
      return;
    }
    game.players.forEach(player => {
      const timeline = getPlayerTimeline(player.id);
      const fileName = path.resolve(`../tmp/${player.name}-${player.id}-${Date.now()}`);
      fs.writeFile(fileName, JSON.stringify(timeline), 'utf8', writeFileError => {
        if (writeFileError) { console.error(writeFileError); }
      });
    });
  });
  return game;
}

export function resetGame(): Game {
  game.players.forEach(player => {
    clearPlayerTimeline(player.id);
  });
  game = initializeGame();
  clearInterval(tickTimer);
  return game;
}

export function addPlayerToGame(playerId: string): Game {
  const user = findUser(playerId);
  if (user && game.players.length < 2 && !game.players.find(({id}) => id === playerId)) {
    game.players.push({...user, readyToPlay: false});
    if (getPlayerTimeline(playerId).length === 0) {
      applyOperation(playerId, {
        from: {ch: 0, line: 0},
        to: {ch: 0, line: 0},
        text: [
          '<!doctype html>',
          '<html>',
          '  <body>',
          '    ',
          '  </body>',
          '</html>'
        ]
      });
      applyOperation(playerId, [
        {
          anchor: {ch: 4, line: 3},
          head: {ch: 4, line: 3}
        }
      ]);
    }
  }
  return game;
}

export function removePlayerFromGame(playerId: string): Game {
  const index = game.players.findIndex(({id}) => id === playerId);
  if (index !== -1) {
    game.players.splice(index, 1);
  }
  return game;
}

export function setPlayerReadyState(playerId: string, readyState: boolean): Game {
  const player = game.players.find(({id}) => id === playerId);
  if (player) {
    player.readyToPlay = readyState;
  }
  return game;
}
