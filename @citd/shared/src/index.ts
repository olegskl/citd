export * from "./reducer";
export * from "./slices/gameSlice";
export * from "./slices/playersSlice";

// import { EditorChangeLinkedList, Position } from "codemirror";

// export interface UserCreate {
//   name: string;
//   avatar?: any;
// }

// export interface User extends UserCreate {
//   id: string;
// }

// export interface Player extends User {
//   readyToPlay: boolean;
// }

// export interface Game {
//   status: "waiting" | "playing" | "paused" | "ended";
//   timeRemaining: number;
//   players: Player[];
// }

// export type Change = EditorChangeLinkedList;
// export type Selection = { anchor: Position; head: Position };
// export type Operation = Change | Selection[];

// export function isChange(operation: Operation): operation is Change {
//   return !Array.isArray(operation);
// }

// export function isSelections(operation: Operation): operation is Selection[] {
//   return Array.isArray(operation);
// }
