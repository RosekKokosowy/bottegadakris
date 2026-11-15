/** Uploaded files are stored as `/files/<name>` and served by /api/files/<name>; full URLs pass through. */
export const getAbsoluteUrl = (link: string): string => {
  const trimmed = link.trim();
  return trimmed.startsWith("http") ? trimmed : `/api${trimmed}`;
};

/** Original file name of an upload (`<random>_<timestamp>_<name>`). */
export const getFileName = (link: string): string => {
  const last = link.trim().split("/").at(-1) ?? link;
  return link.trim().startsWith("/files") ? last.split("_").slice(2).join("_") || last : last;
};
