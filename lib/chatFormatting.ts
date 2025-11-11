const TITLE_CASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bpre[\s-]?tax deductions\b/gi, "Pre Tax Deductions"],
  [/\bpost[\s-]?tax deductions\b/gi, "Post Tax Deductions"],
  [/\bgross pay\b/gi, "Gross Pay"],
  [/\bfederal income tax\b/gi, "Federal Income Tax"],
  [/\bsocial security\b/gi, "Social Security"],
  [/\bmedicare\b/gi, "Medicare"],
  [/\bstate tax\b/gi, "State Tax"],
  [/\blocal taxes\b/gi, "Local Taxes"],
  [/\btake-home pay\b/gi, "Take-Home Pay"],
  [/\beffective tax rate\b/gi, "Effective Tax Rate"],
];

export function formatAssistantText(text: string | null | undefined): string {
  if (!text) return text ?? "";

  let formatted = text;

  for (const [pattern, replacement] of TITLE_CASE_REPLACEMENTS) {
    formatted = formatted.replace(pattern, replacement);
  }

  return formatted;
}

