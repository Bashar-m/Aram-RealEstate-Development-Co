/** Fills `{name}` placeholders in translated strings: format("{i} of {n}", { i: 1, n: 9 }) */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
