export function formatTokenLabel(value: string) {
  return value
    .split("_")
    .map((part) => {
      if (!part) {
        return part;
      }

      return part[0].toUpperCase() + part.slice(1);
    })
    .join(" ");
}
