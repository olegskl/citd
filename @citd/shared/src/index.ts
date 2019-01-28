export interface IGame {
  playerCount: number;
  timeElapsed: number;
  timeRemaining: number;
  status: 'waitingForPlayers' | 'playing' | 'paused' | 'ended';
}

export interface IGamePlayer {
  id: string;
  nickname: string;
  model: string;
}

export interface IChanges {
  userId: number;
  changes: any;
}
