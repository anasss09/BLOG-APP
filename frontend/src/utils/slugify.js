export const slugify = (text) =>
  text
    ?.toLowerCase()
    .replace(/&/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");