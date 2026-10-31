import en from "@/locales/en.json";

export function t(path: string): string {
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (typeof current === "object" && current !== null && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, en);

  return typeof value === "string" ? value : path;
}

export function tReplace(path: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value), t(path));
}
