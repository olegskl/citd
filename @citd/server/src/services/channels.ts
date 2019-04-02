import * as WebSocket from 'ws';

interface Channel {
  name: string;
  client: WebSocket;
}

let channels: Channel[] = [];

export function getClientsInChannel(name: string): WebSocket[] {
  return channels
    .filter(channel => channel.name === name)
    .map(channel => channel.client);
}

export function addClientToChannel(client: WebSocket, name: string) {
  if (!channels.find(channel => channel.client === client && channel.name === name)) {
    channels.push({name, client});
  }
}

export function removeClientFromChannel(client: WebSocket, name: string) {
  channels = channels.filter(channel => channel.client !== client && channel.name !== name);
}

export function removeClientFromAllChannels(client: WebSocket) {
  channels = channels.filter(channel => channel.client !== client);
}
