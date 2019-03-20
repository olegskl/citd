import { EditorChangeLinkedList, Position } from 'codemirror';

export interface IGame {
  playerCount: number;
  timeElapsed: number;
  timeRemaining: number;
  status: 'waitingForPlayers' | 'playing' | 'paused' | 'ended';
}

export interface IGamePlayer {
  id: string;
  nickname: string;
  changes: EditorChangeLinkedList[];
  selections: Array<{
    anchor: Position;
    head: Position
  }>;
}
