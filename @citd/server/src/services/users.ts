import { User } from '@citd/shared';

import { uid } from '../helpers/uid';

const users: {[id: string]: User} = {};

export function findUser(userId: string) {
  return users[userId];
}

export function createUser(name: string) {
  const user: User = {id: uid(), name};
  users[user.id] = user;
  return user;
}
