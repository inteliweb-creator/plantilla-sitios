/**
 * Texto que se ilumina palabra a palabra, del gris apagado al negro.
 *
 * Es el mismo lenguaje de la escena del problema en la portada: la luz "lee"
 * la frase a medida que avanza el scroll. Cada palabra tarda una palabra en
 * encenderse, así el frente de luz es suave y no un corte duro.
 */
const APAGADO = [196, 199, 204];
const ENCENDIDO = [14, 15, 17];

const limitar = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function Iluminado({ texto, avance }) {
  const palabras = texto.split(' ');
  const n = palabras.length;
  return palabras.map((palabra, k) => {
    const t = limitar(avance * n - k);
    const color = APAGADO.map((c, i) => Math.round(c + (ENCENDIDO[i] - c) * t));
    return (
      <span key={k} style={{ color: `rgb(${color.join(',')})`, transition: 'color 0.15s linear' }}>
        {palabra}
        {k < n - 1 ? ' ' : ''}
      </span>
    );
  });
}
