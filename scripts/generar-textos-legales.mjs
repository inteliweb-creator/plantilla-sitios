/** Convierte los .md de src/scripts/legales en textos.ts (lo que usa la carga de ejemplo). */
import fs from 'node:fs'
const leer = (f) => fs.readFileSync(`src/scripts/legales/${f}.md`, 'utf8').replace(/\r\n?/g, '\n')
const cabecera = fs.readFileSync('src/scripts/legales/textos.ts', 'utf8').split('export const')[0]
fs.writeFileSync(
  'src/scripts/legales/textos.ts',
  cabecera + ['privacidad', 'cookies', 'terminos'].map((s) => `export const ${s} = ${JSON.stringify(leer(s))}`).join('\n\n') + '\n',
)
console.log('Listo: src/scripts/legales/textos.ts')
