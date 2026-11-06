export const pads = [
  {
    id: 'tom1',
    name: 'Tom 1',
    key: 'W',
    code: 'KeyW',
    sound: '/sounds/tom-1.mp3',
  },
  {
    id: 'tom2',
    name: 'Tom 2',
    key: 'A',
    code: 'KeyA',
    sound: '/sounds/tom-2.mp3',
  },
  {
    id: 'tom3',
    name: 'Tom 3',
    key: 'S',
    code: 'KeyS',
    sound: '/sounds/tom-3.mp3',
  },
  {
    id: 'tom4',
    name: 'Tom 4',
    key: 'D',
    code: 'KeyD',
    sound: '/sounds/tom-4.mp3',
  },
  {
    id: 'snare',
    name: 'Snare',
    key: 'J',
    code: 'KeyJ',
    sound: '/sounds/snare.mp3',
  },
  {
    id: 'crash',
    name: 'Crash',
    key: 'K',
    code: 'KeyK',
    sound: '/sounds/crash.mp3',
  },
  {
    id: 'kick',
    name: 'Kick',
    key: 'L',
    code: 'KeyL',
    sound: '/sounds/kick-bass.mp3',
  },
];

// Tra cứu trống theo mã phím vật lý.
export const padMap = new Map(
  pads.map((pad) => [pad.code, pad])
);