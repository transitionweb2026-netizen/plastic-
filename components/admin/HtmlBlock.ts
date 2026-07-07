import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Opaque passthrough node for markup the rich-text schema doesn't model
 * (the existing 4 articles' stat-card grids, share-button rows, prev/next
 * blocks — see lib/articles.ts's bodyHtml). Only <p>/<h2>/<ul>/<li>/
 * <blockquote>/<a>/<strong>/<em> are genuinely rich-text editable; any
 * <div> encountered while loading existing HTML is captured verbatim here
 * instead of being silently dropped by the schema, and is rendered
 * read-only (not richly editable) in the editor — repositionable as a
 * whole block, but its markup itself is preserved exactly, not rewritten.
 *
 * Round-trip approach: rather than trying to make ProseMirror's node-tree
 * serializer reconstruct arbitrary nested HTML (fragile for unknown/deep
 * markup), each captured block gets an id; the ORIGINAL HTML string is
 * kept in `registry` (shared with the component via configure()), and the
 * node itself renders only a small id-tagged marker. The saving component
 * swaps each marker back to its true source HTML after editor.getHTML().
 */
export const HtmlBlock = Node.create<{ registry: Map<string, string> }>({
  name: "htmlBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { registry: new Map<string, string>() };
  },

  addAttributes() {
    return {
      blockId: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div",
        priority: 100,
        getAttrs: (dom) => {
          if (typeof dom === "string") return false;
          const el = dom as HTMLElement;
          // The article's own prose wrapper must stay transparent so its
          // real content (headings/paragraphs/lists/etc.) parses as
          // genuine rich text — only OTHER divs (stat strips, share row,
          // prev/next nav) get captured as opaque blocks. See
          // lib/articles.ts's bodyHtml for the "prose-content" wrapper.
          if (el.classList.contains("prose-content")) return false;
          const id = `hb-${Math.random().toString(36).slice(2, 10)}`;
          this.options.registry.set(id, el.outerHTML);
          return { blockId: id };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-html-block-id": HTMLAttributes.blockId }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.setAttribute("data-html-block-id", node.attrs.blockId ?? "");
      dom.contentEditable = "false";
      dom.style.cssText =
        "opacity:.55;border:1px dashed #999;border-radius:6px;padding:10px;margin:8px 0;font-size:11px;pointer-events:none;overflow:hidden;max-height:120px;";
      const html = this.options.registry.get(node.attrs.blockId) ?? "";
      dom.innerHTML =
        `<div style="font-weight:700;opacity:.8;margin-bottom:4px;pointer-events:auto">` +
        `⚙ preserved block (not freely editable)</div>` +
        html;
      return { dom };
    };
  },
});

/** After editor.getHTML(), swap each empty marker div back to the exact
 *  original HTML it was parsed from, using the same registry instance. */
export function resolveHtmlBlocks(html: string, registry: Map<string, string>): string {
  return html.replace(
    /<div[^>]*data-html-block-id="([^"]+)"[^>]*><\/div>/g,
    (match, id: string) => registry.get(id) ?? match
  );
}
