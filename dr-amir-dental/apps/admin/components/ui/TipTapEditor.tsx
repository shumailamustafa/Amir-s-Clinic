'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';
import { Button } from '@dental/ui';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] p-4 max-w-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`w-8 h-8 p-0 ${editor.isActive('bold') ? 'bg-[var(--color-primary)] text-white' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-8 h-8 p-0 ${editor.isActive('italic') ? 'bg-[var(--color-primary)] text-white' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`w-8 h-8 p-0 ${editor.isActive('underline') ? 'bg-[var(--color-primary)] text-white' : ''}`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-[var(--color-border)] mx-1 self-center" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`w-8 h-8 p-0 ${editor.isActive('bulletList') ? 'bg-[var(--color-primary)] text-white' : ''}`}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`w-8 h-8 p-0 ${editor.isActive('orderedList') ? 'bg-[var(--color-primary)] text-white' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`w-8 h-8 p-0 ${editor.isActive('blockquote') ? 'bg-[var(--color-primary)] text-white' : ''}`}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-[var(--color-border)] mx-1 self-center" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            } else if (url === '') {
              editor.chain().focus().unsetLink().run();
            }
          }}
          className={`w-8 h-8 p-0 ${editor.isActive('link') ? 'bg-[var(--color-primary)] text-white' : ''}`}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
          className="w-8 h-8 p-0"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
          className="w-8 h-8 p-0"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg)] flex flex-col">
      <MenuBar />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--color-text-tertiary);
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
