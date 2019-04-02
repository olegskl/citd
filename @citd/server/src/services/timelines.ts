import { Operation } from '@citd/shared';

export const timelines: {[id: string]: Operation[]} = {};

export function getPlayerTimeline(id: string): Operation[] {
  return timelines[id] || [];
}

export function clearPlayerTimeline(id: string) {
  delete timelines[id];
}

export function applyOperation(id: string, operation: Operation): Operation[] {
  timelines[id] = timelines[id] || [];
  timelines[id].push(operation);
  return timelines[id];
}
