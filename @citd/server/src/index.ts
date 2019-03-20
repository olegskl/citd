import * as http from 'http';
import { Server as WebSocketServer, OPEN } from 'ws';

import { startGame, pauseGame, unpauseGame } from './game';
import { addPlayer, getPlayer, getPlayerList, removePlayer, applyChange, setSelections } from './players';

const server = http.createServer();
const ws = new WebSocketServer({server, path: '/sock'});

server.listen(3000, '127.0.0.1');

ws.on('connection', client => {

  client.on('message', message => {
    if (typeof message !== 'string') { return; }
    const [eventName, ...args] = JSON.parse(message);

    if (eventName === 'startGame') {
      const message = JSON.stringify(['gameStarted', startGame()]);
      ws.clients.forEach(c => c.send(message));
    } else if (eventName === 'pauseGame') {
      const message = JSON.stringify(['gamePaused', pauseGame()]);
      ws.clients.forEach(c => c.send(message));
    } else if (eventName === 'unpauseGame') {
      const message = JSON.stringify(['gameUnpaused', unpauseGame()]);
      ws.clients.forEach(c => c.send(message));
    }

    else if (eventName === 'getPlayerList') {
      client.send(JSON.stringify(['playerList', getPlayerList()]));
    } else if (eventName === 'getPlayer') {
      client.send(JSON.stringify(['player', getPlayer(args[0])]));
    }

    else if (eventName === 'joinGame') {
      const [playerName] = args;
      client.send(JSON.stringify(['gameJoined', addPlayer(playerName)]));
      const message = JSON.stringify(['playerList', getPlayerList()]);
      ws.clients.forEach(c => c.send(message));
    } else if (eventName === 'leaveGame') {
      const [playerId] = args;
      client.send(JSON.stringify(['gameLeft', removePlayer(playerId)]));
      const message = JSON.stringify(['playerList', getPlayerList()]);
      ws.clients.forEach(c => c.send(message));
    }

    else if (eventName === 'selections') {
      const [playerId, selections] = args;
      setSelections(playerId, selections);
      const message = JSON.stringify(['selections', playerId, selections]);
      ws.clients.forEach(c => {
        if (c !== client && c.readyState === OPEN) {
          c.send(message);
        }
      });
    } else if (eventName === 'change') {
      const [playerId, change] = args;
      applyChange(playerId, change);
      const message = JSON.stringify(['change', playerId, change]);
      ws.clients.forEach(c => {
        if (c !== client && c.readyState === OPEN) {
          c.send(message);
        }
      });
    }
  });
});
