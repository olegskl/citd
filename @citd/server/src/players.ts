import { IGamePlayer } from '@citd/shared';
import { Doc, EditorChangeLinkedList, Position } from 'codemirror';

let players: IGamePlayer[] = [];

export function getPlayer(playerId: string): IGamePlayer | undefined {
  return players.find(player => player.id === playerId);
}

export function getPlayerList() {
  return players;
}

export function addPlayer(nickname: string): IGamePlayer {
  const newPlayer: IGamePlayer = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    nickname,
    changes: [{
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
    }],
    selections: [
      {
        anchor: {ch: 4, line: 3},
        head: {ch: 4, line: 3}
      }
    ]
  };
  players.push(newPlayer);
  return newPlayer;
}

export function applyChange(playerId: string, change: EditorChangeLinkedList): IGamePlayer | undefined {
  const playerToUpdate = getPlayer(playerId);
  if (playerToUpdate) {
    playerToUpdate.changes.push(change);
    return playerToUpdate;
  }
}

export function setSelections(playerId: string, selections: IGamePlayer['selections']): IGamePlayer | undefined {
  const playerToUpdate = getPlayer(playerId);
  if (playerToUpdate) {
    playerToUpdate.selections = selections;
    return playerToUpdate;
  }
}

export function removePlayer(playerId: string): void {
  const playerToRemove = getPlayer(playerId);
  if (playerToRemove) {
    players.splice(players.indexOf(playerToRemove), 1);
  }
}
