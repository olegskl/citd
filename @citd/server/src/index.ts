import { Game, GameStatuses } from '@citd/shared';
import * as http from 'http';
import * as WebSocket from 'ws';

import {
  getClientsInChannel,
  addClientToChannel,
  removeClientFromChannel,
  removeClientFromAllChannels
} from './services/channels';
import {
  getGame,
  startGame,
  pauseGame,
  resetGame,
  addPlayerToGame,
  removePlayerFromGame,
  setPlayerReadyState,
  onGameTick,
  offGameTick
} from './services/game';
import { applyOperation, getPlayerTimeline } from './services/timelines';
import { createUser, findUser } from './services/users';

const server = http.createServer();
const ws = new WebSocket.Server({server, path: '/sock'});

server.listen(3000, '127.0.0.1');

ws.on('connection', client => {

  const handleGameTick = (game: Game) => {
    const message = game.status === GameStatuses.PLAYING
      ? JSON.stringify(['timeRemaining', game.timeRemaining])
      : JSON.stringify(['game', game]);
    ws.clients.forEach(c => {
      if (c.readyState === WebSocket.OPEN) {
        c.send(message);
      }
    });
  };

  onGameTick(handleGameTick);
  client.on('closing', () => {
    offGameTick(handleGameTick);
    removeClientFromAllChannels(client);
  });
  client.on('close', () => {
    offGameTick(handleGameTick);
    removeClientFromAllChannels(client);
  });

  client.on('message', message => {
    if (typeof message !== 'string') { return; }
    const [eventName, ...args] = JSON.parse(message);

    if (eventName === 'joinChannel') {
      const [channelName] = args;
      addClientToChannel(client, channelName);
    } else if (eventName === 'leaveChannel') {
      const [channelName] = args;
      removeClientFromChannel(client, channelName);
    }

    else if (eventName === 'getUser') {
      const [userId] = args;
      const message = JSON.stringify(['user', findUser(userId)]);
      client.send(message);
    } else if (eventName === 'createUser') {
      const [name] = args;
      const message = JSON.stringify(['user', createUser(name)]);
      client.send(message);
    }

    else if (eventName === 'getGame') {
      const message = JSON.stringify(['game', getGame()]);
      client.send(message);
    } else if (eventName === 'startGame') {
      const message = JSON.stringify(['game', startGame()]);
      ws.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    } else if (eventName === 'pauseGame') {
      const message = JSON.stringify(['game', pauseGame()]);
      ws.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    } else if (eventName === 'resetGame') {
      const message = JSON.stringify(['game', resetGame()]);
      ws.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    }

    else if (eventName === 'joinGame') {
      const [playerId] = args;
      const message = JSON.stringify(['game', addPlayerToGame(playerId)]);
      ws.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    } else if (eventName === 'leaveGame' || eventName === 'kickPlayerFromGame') {
      const [playerId] = args;
      const message = JSON.stringify(['game', removePlayerFromGame(playerId)]);
      ws.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    }
    else if (eventName === 'readyToPlay') {
      const [playerId, readyState] = args;
      const message = JSON.stringify(['game', setPlayerReadyState(playerId, readyState)]);
      ws.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    }

    else if (eventName === 'getPlayerTimeline') {
      const [playerId] = args;
      client.send(JSON.stringify(['playerTimeline', playerId, getPlayerTimeline(playerId)]));
    }
    else if (eventName === 'operation') {
      const [playerId, operation] = args;
      applyOperation(playerId, operation);
      const message = JSON.stringify(['operation', playerId, operation]);
      getClientsInChannel('observers').forEach(c => {
        if (c !== client && c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    }
  });
});
