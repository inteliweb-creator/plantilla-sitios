import React from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'

import { anclaDe, textoDe } from './datos'

/**
 * Texto del artículo con el estilo del blog (.prose-sitio). Los títulos
 * llevan un id para que el índice "En este artículo" pueda saltar a ellos.
 */
const convertidores: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Etiqueta = node.tag as 'h2' | 'h3' | 'h4'
    return <Etiqueta id={anclaDe(textoDe(node))}>{nodesToJSX({ nodes: node.children })}</Etiqueta>
  },
})

export default function ContenidoArticulo({ data }: { data: SerializedEditorState }) {
  if (!data) return null
  return <RichText data={data} converters={convertidores} disableContainer />
}
