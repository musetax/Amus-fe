export function normalizeMarkdownText(text: string): string {
  if (!text) return text;

  let normalized = text.replace(/\r\n/g, "\n");

  if (normalized.includes("\\n")) {
    normalized = normalized.replace(/\\n/g, "\n");
  }

  if (!normalized.includes("- ") && !normalized.includes("*") && !normalized.includes("1.")) {
    normalized = normalized.replace(/(?<=\S)\n(?=\S)/g, " ");
  }

  normalized = normalized.replace(/(?<!\\)\$/g, "\\$");

  return normalized.replace(/^\n+/, "");
}

export function attachSourceLinks(text: string, urls?: string[]): string {
  if (!text || !urls?.length) return text;

  const urlQueue = [...urls];
  const pattern = /\(Source:[^)]*\)|Source:[^\n]*/gi;

  return text.replace(pattern, (match) => {
    if (!urlQueue.length || match.includes("](")) return match;

    const trimmed = match.trim();
    const hasOpeningParen = trimmed.startsWith("(");
    const hasClosingParen = trimmed.endsWith(")");

    let inner = trimmed;
    if (hasOpeningParen) inner = inner.slice(1);
    if (hasClosingParen) inner = inner.slice(0, -1);

    if (!inner.toLowerCase().startsWith("source:")) return match;

    const content = inner.slice("Source:".length).trim();
    if (!content) return match;

    const url = urlQueue.shift();
    if (!url) return match;

    return `${hasOpeningParen ? "(" : ""}Source: [${content}](${url})${hasClosingParen ? ")" : ""}`;
  });
}

