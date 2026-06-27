'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface LetterEditorProps {
  value?:       string
  onChange:     (value: string) => void
  placeholder?: string
  className?:   string
}

export function LetterEditor({
  value,
  onChange,
  placeholder = 'Begin writing your letter...',
  className,
}: LetterEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: (() => {
      if (!value) return ''
      try { return JSON.parse(value) } catch { return value }
    })(),
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[200px] leading-relaxed text-charcoal text-sm',
      },
    },
    immediatelyRender: false,
  })

  const ToolbarButton = ({
    onClick, active, children, title,
  }: {
    onClick: () => void; active?: boolean; children: React.ReactNode; title: string
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={cn(
        'p-1.5 rounded transition-colors duration-150',
        active ? 'bg-charcoal text-ivory' : 'text-warm-gray hover:text-charcoal hover:bg-stone/50',
      )}
    >
      {children}
    </button>
  )

  return (
    <div className={cn('rounded-xl border border-stone bg-ivory overflow-hidden', className)}>
      {/* Toolbar */}
      {editor && (
        <div className="flex items-center gap-1 border-b border-stone px-3 py-2">
          <ToolbarButton
            title="Bold"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={14} />
          </ToolbarButton>
          <div className="w-px h-4 bg-stone mx-1" />
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={14} />
          </ToolbarButton>
        </div>
      )}

      {/* Editor area — paper feel */}
      <div
        className="px-5 py-4 font-sans"
        style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #E8E2D9 27px, #E8E2D9 28px)', lineHeight: '28px' }}
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #9B9189;
          opacity: 0.6;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap p { margin: 0; }
        .tiptap ul { padding-left: 1.25rem; }
        .tiptap strong { font-weight: 600; }
        .tiptap em { font-style: italic; }
      `}</style>
    </div>
  )
}
