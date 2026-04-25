import { slugify } from "./slugify";

export const stripHtml = (value = "") => value.replace(/<[^>]+>/g, "").trim();

export const matchesQuery = (query, fields) => {
  const normalizedQuery = String(query || "").toLowerCase().trim();

  if (!normalizedQuery) return false;

  return fields.some((field) =>
    String(field || "")
      .toLowerCase()
      .includes(normalizedQuery)
  );
};

const getMatchRank = (value, query) => {
  const normalizedValue = String(value || "").toLowerCase();

  if (!normalizedValue || !query) return 0;
  if (normalizedValue.startsWith(query)) return 3;
  if (normalizedValue.includes(query)) return 1;

  return 0;
};

const buildSearchEntries = (blogs = [], newsList = [], events = []) => [
  ...blogs.map((item) => ({
    id: item._id,
    type: "Research",
    title: item.title,
    category: item.category || "Research",
    description: stripHtml(item.description),
    meta: item.readTime || item.author || "Research article",
    path: `/research/${slugify(item.category || "research")}/${slugify(item.title)}`,
  })),
  ...newsList.map((item) => ({
    id: item._id,
    type: "News",
    title: item.title,
    category: item.category || "General",
    description: stripHtml(item.description),
    meta: item.readTime || item.author || "News update",
    path: `/news/${slugify(item.category || "general")}/${slugify(item.title)}`,
  })),
  ...events.map((item) => ({
    id: item._id,
    type: "Event",
    title: item.title,
    category: item.category || "Event",
    description: stripHtml(item.description),
    meta: item.location || item.author || "Upcoming event",
    path: `/events/${slugify(item.category || "event")}/${slugify(item.title)}`,
  })),
];

export const getSearchSuggestions = ({
  query,
  blogs = [],
  newsList = [],
  events = [],
  limit = 8,
}) => {
  const normalizedQuery = String(query || "").toLowerCase().trim();

  if (!normalizedQuery) return [];

  return buildSearchEntries(blogs, newsList, events)
    .map((item) => {
      const titleRank = getMatchRank(item.title, normalizedQuery);
      const categoryRank = getMatchRank(item.category, normalizedQuery);
      const metaRank = getMatchRank(item.meta, normalizedQuery);
      const descriptionRank = getMatchRank(item.description, normalizedQuery);
      const score =
        titleRank * 100 +
        categoryRank * 40 +
        metaRank * 20 +
        descriptionRank * 10;

      return { ...item, score };
    })
    .filter(
      (item) =>
        item.score > 0 ||
        matchesQuery(normalizedQuery, [
          item.title,
          item.category,
          item.description,
          item.meta,
        ])
    )
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
};
