type TiptapNode = {
  type:    string
  text?:   string
  marks?:  Array<{ type: string; attrs?: Record<string, unknown> }>
  content?: TiptapNode[]
  attrs?:  Record<string, unknown>
}

export function tiptapJsonToHtml(json: string): string {
  try {
    return renderNode(JSON.parse(json) as TiptapNode)
  } catch {
    return escapeHtml(json)
  }
}

function renderNode(node: TiptapNode): string {
  if (node.type === 'text') {
    let text = escapeHtml(node.text ?? '')
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold')   text = `<strong>${text}</strong>`
      if (mark.type === 'italic') text = `<em>${text}</em>`
      if (mark.type === 'strike') text = `<s>${text}</s>`
      if (mark.type === 'code')   text = `<code>${text}</code>`
      if (mark.type === 'link')   text = `<a href="${mark.attrs?.href ?? '#'}">${text}</a>`
    }
    return text
  }

  const inner = (node.content ?? []).map(renderNode).join('')
  const lvl   = node.attrs?.level ?? 2

  switch (node.type) {
    case 'doc':          return inner
    case 'paragraph':    return `<p>${inner || ' '}</p>`
    case 'heading':      return `<h${lvl}>${inner}</h${lvl}>`
    case 'bulletList':   return `<ul>${inner}</ul>`
    case 'orderedList':  return `<ol>${inner}</ol>`
    case 'listItem':     return `<li>${inner}</li>`
    case 'blockquote':   return `<blockquote>${inner}</blockquote>`
    case 'hardBreak':    return '<br>'
    case 'horizontalRule': return '<hr>'
    default:             return inner
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
