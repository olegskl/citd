import airplane from './assets/airplane.png';
import avatar from './assets/avatar.png';
import b from './assets/b.png';
import ba from './assets/ba.png';
import bee from './assets/bee.png';
import circles from './assets/circles.png';
import cuckoo from './assets/cuckoo.png';
import eye from './assets/eye.png';
import g from './assets/g.png';
import greenblob from './assets/greenblob.png';
import kodak from './assets/kodak.png';
import overlap from './assets/overlap.png';
import propeller from './assets/propeller.png';
import defaultTask from './assets/defaultTask.png';
import tiles from './assets/tiles.png';
import usa from './assets/usa.png';
import wing from './assets/wing.png';

type Task = { name: string; url: string; color: string };

export const tasks: Record<string, Task> = {
  defaultTask: { name: 'Default task', url: defaultTask, color: '#e33b55' },
  // easy
  usa: { name: 'usa', url: usa, color: '#ffffff' },
  b: { name: 'b', url: b, color: '#ffffff' },
  bee: { name: 'bee', url: bee, color: '#f7eee0' },
  circles: { name: 'circles', url: circles, color: '#dedfdf' },
  greenblob: { name: 'greenblob', url: greenblob, color: '#5a5051' },
  propeller: { name: 'propeller', url: propeller, color: '#ffffff' },
  eye: { name: 'eye', url: eye, color: '#ffffff' },
  // hard
  g: { name: 'g', url: g, color: '#ffffff' },
  cuckoo: { name: 'cuckoo', url: cuckoo, color: '#ffffff' },
  overlap: { name: 'overlap', url: overlap, color: '#fff9f0' },
  wing: { name: 'wing', url: wing, color: '#fd766c' },
  kodak: { name: 'kodak', url: kodak, color: '#ffc803' },
  ba: { name: 'ba', url: ba, color: '#ffffff' },
  airplane: { name: 'airplane', url: airplane, color: '#a1ebff' },
  avatar: { name: 'avatar', url: avatar, color: '#ffffff' },
  tiles: { name: 'tiles', url: tiles, color: '#ffffff' },
};
