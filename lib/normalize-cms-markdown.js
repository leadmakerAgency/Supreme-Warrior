/**
 * Converts workflow/CMS plain-text headings into valid Markdown.
 *
 * Workflow output often uses lines like:
 *   H2: Section title
 *   Body paragraph on the next line
 *
 * Without a blank line and without ## prefixes, markdown renders everything
 * as a single <p> tag.
 */
function normalizeCmsMarkdown(content) {
  if (!content || typeof content !== "string") return content;

  let text = content.replace(/\r\n/g, "\n");

  // Workflow labels for the opening paragraph (Hook, Lede, Teaser, etc.)
  text = text.replace(
    /^\s*(Hook|Lede|Teaser|Opening):\s*(.+)/i,
    (_, _label, body) => `<p class="post-lede">${body.trim()}</p>`
  );

  // H1: … H6: → # … ######
  text = text.replace(/^H([1-6]):\s*(.+)$/gim, (_, level, title) => {
    return `${"#".repeat(Number(level))} ${title.trim()}`;
  });

  // Common standalone section labels from CMS exports
  text = text.replace(
    /^(Introduction|Conclusion|Summary|Overview|Key [Tt]akeaways)$/gim,
    "## $1"
  );

  // Ensure headings are separated from the paragraph that follows
  text = text.replace(/^(#{1,6}\s+.+)\n(?!\n)(?![#\-*>\d|])/gm, "$1\n\n");

  return text;
}

module.exports = { normalizeCmsMarkdown };
