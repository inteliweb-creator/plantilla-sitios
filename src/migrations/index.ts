import * as migration_20260916_165904_inicial from './20260916_165904_inicial';

export const migrations = [
  {
    up: migration_20260916_165904_inicial.up,
    down: migration_20260916_165904_inicial.down,
    name: '20260916_165904_inicial'
  },
];
