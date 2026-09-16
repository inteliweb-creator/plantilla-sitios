import * as migration_20260916_165904_inicial from './20260916_165904_inicial';
import * as migration_20260916_223333_asistente from './20260916_223333_asistente';

export const migrations = [
  {
    up: migration_20260916_165904_inicial.up,
    down: migration_20260916_165904_inicial.down,
    name: '20260916_165904_inicial',
  },
  {
    up: migration_20260916_223333_asistente.up,
    down: migration_20260916_223333_asistente.down,
    name: '20260916_223333_asistente'
  },
];
