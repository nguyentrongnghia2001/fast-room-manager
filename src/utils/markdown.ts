/**
 * Lightweight helper to safely format markdown-like text to HTML for chat bubbles
 */
export function formatMarkdownToHtml(text: string): string {
  if (!text) return ''

  // Escape HTML tags to prevent XSS
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks ```code```
  escaped = escaped.replace(/```([\s\S]*?)```/g, (_match, p1) => {
    return `<pre class="bg-gray-800 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto text-xs font-mono"><code>${p1.trim()}</code></pre>`
  })

  // Inline code `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-primary-700 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')

  // Bold **text**
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')

  // Italic *text*
  escaped = escaped.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')

  // Bullet points
  const lines = escaped.split('\n')
  const formattedLines: string[] = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const bulletMatch = line.match(/^(\s*)[-*•]\s+(.*)$/)
    const numberMatch = line.match(/^(\s*)\d+\.\s+(.*)$/)

    if (bulletMatch) {
      if (!inList) {
        formattedLines.push('<ul class="list-disc list-inside space-y-1 my-1.5 text-gray-700">')
        inList = true
      }
      formattedLines.push(`  <li>${bulletMatch[2]}</li>`)
    } else if (numberMatch) {
      if (!inList) {
        formattedLines.push('<ol class="list-decimal list-inside space-y-1 my-1.5 text-gray-700">')
        inList = true
      }
      formattedLines.push(`  <li>${numberMatch[2]}</li>`)
    } else {
      if (inList) {
        formattedLines.push('</ul>')
        inList = false
      }
      if (line.trim().startsWith('### ')) {
        formattedLines.push(`<h4 class="font-bold text-gray-900 text-sm mt-3 mb-1">${line.replace('### ', '')}</h4>`)
      } else if (line.trim().startsWith('## ')) {
        formattedLines.push(`<h3 class="font-bold text-gray-900 text-base mt-3 mb-1.5">${line.replace('## ', '')}</h3>`)
      } else if (line.trim().startsWith('# ')) {
        formattedLines.push(`<h2 class="font-bold text-gray-900 text-lg mt-4 mb-2">${line.replace('# ', '')}</h2>`)
      } else if (line.trim() === '') {
        formattedLines.push('<div class="h-2"></div>')
      } else {
        formattedLines.push(`<p class="my-1">${line}</p>`)
      }
    }
  }

  if (inList) {
    formattedLines.push('</ul>')
  }

  return formattedLines.join('')
}
