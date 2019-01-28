import { IGamePlayer } from '@citd/shared';

let players: IGamePlayer[] = [];

export function getPlayer(playerId: string): IGamePlayer | undefined {
  return players.find(player => player.id === playerId);;
}

export function getPlayerList() {
  return players;
}

export function addPlayer(nickname: string): IGamePlayer {
  const newPlayer: IGamePlayer = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    nickname,
    model: '<!doctype html>\n<html>\n\n</html>'
  };
  players.push(newPlayer);
  return newPlayer;
}

export function removePlayer(playerId: string): void {
  const playerToRemove = getPlayer(playerId);
  if (playerToRemove) {
    players.splice(players.indexOf(playerToRemove), 1);
  }
}

export function commitModel(playerId: string, model: string): void {
  const playerToUpdate = getPlayer(playerId);
  if (playerToUpdate) {
    playerToUpdate.model = model;
  }
}
