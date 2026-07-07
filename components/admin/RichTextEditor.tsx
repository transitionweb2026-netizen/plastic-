"use client";

import { useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "isomorphic-dompurify";
import { HtmlBlock, resolveHtmlBlocks } from "./HtmlBlock";

const inputCls =
  "w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm";

const toolbarBtnCls =
  "px-2.5 py-1 rounded text-xs font-bold border border-outline-variant hover:bg-surface-container-high transition-colors";

/**
 * Rich-text HTML editor for article bodies (see lib/articles.ts's
 * bodyHtml). Genuine prose (headings/paragraphs/lists/blockquotes/links/
 * bold/italic) is freely editable; any <div>-based markup already present
 * in the source (stat-card strips, share/nav blocks) is preserved as an
 * opaque block — see HtmlBlock.ts for why plain textarea round-tripping
 * isn't attempted for that part.
 */
export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  // One registry per mount, shared between the parse-time capture and the
  // save-time substitution — see HtmlBlock.ts.
  const registry = useMemo(() => new Map<string, string>(), []);
  const loadedRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      HtmlBlock.configure({ registry }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const raw = editor.getHTML();
      const resolved = resolveHtmlBlocks(raw, registry);
      onChange(DOMPurify.sanitize(resolved, { ADD_ATTR: ["target"] }));
    },
  });

  // Re-sync if a different article is selected after this editor mounted.
  useEffect(() => {
    if (!editor || loadedRef.current) {
      loadedRef.current = true;
      return;
    }
  }, [editor]);

  if (!editor) return <div className={inputCls}>Loading editor…</div>;

  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1.5 p-2 bg-surface-container-low border-b border-outline-variant">
        <button
          type="button"
          className={toolbarBtnCls}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={`${toolbarBtnCls} italic`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          i
        </button>
        <button
          type="button"
          className={toolbarBtnCls}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={toolbarBtnCls}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          type="button"
          className={toolbarBtnCls}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          " Quote
        </button>
        <button
          type="button"
          className={toolbarBtnCls}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[240px] focus:outline-none [&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:outline-none"
      />
      <p className="text-xs text-on-surface-variant px-3 py-2 bg-surface-container-lowest border-t border-outline-variant">
        Formatted text (headings, paragraphs, lists, links, bold/italic) is
        fully editable. Grayed-out blocks are structured page elements
        (stats, navigation) preserved as-is — not freely editable here.
      </p>
    </div>
  );
}
