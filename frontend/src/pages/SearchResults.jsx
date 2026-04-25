import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Search } from "lucide-react";

import { fetchResearch } from "../features/research/researchSlice";
import { fetchNews } from "../features/news/newsSlice";
import { fetchEvents } from "../features/events/eventSlice";
import { slugify } from "../utils/slugify";
import { matchesQuery, stripHtml } from "../utils/search";

const ResultSection = ({ title, items, renderItem, emptyLabel }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <span className="text-sm text-slate-500">{items.length} result(s)</span>
    </div>

    {items.length === 0 ? (
      <p className="text-slate-500">{emptyLabel}</p>
    ) : (
      <div className="space-y-4">{items.map(renderItem)}</div>
    )}
  </section>
);

const SearchResults = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const { blogs = [], loading: researchLoading } = useSelector(
    (state) => state.research
  );
  const { newsList = [], loading: newsLoading } = useSelector(
    (state) => state.news
  );
  const { events = [], loading: eventsLoading } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    if (!blogs.length) dispatch(fetchResearch());
    if (!newsList.length) dispatch(fetchNews());
    if (!events.length) dispatch(fetchEvents());
  }, [blogs.length, dispatch, events.length, newsList.length]);

  const filteredResearch = query
    ? blogs.filter((item) =>
        matchesQuery(query, [
          item.title,
          item.category,
          stripHtml(item.description),
          item.author,
        ])
      )
    : [];

  const filteredNews = query
    ? newsList.filter((item) =>
        matchesQuery(query, [
          item.title,
          item.category,
          stripHtml(item.description),
          item.author,
        ])
      )
    : [];

  const filteredEvents = query
    ? events.filter((item) =>
        matchesQuery(query, [
          item.title,
          item.category,
          item.location,
          stripHtml(item.description),
          item.author,
        ])
      )
    : [];

  const loading =
    (researchLoading && blogs.length === 0) ||
    (newsLoading && newsList.length === 0) ||
    (eventsLoading && events.length === 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_14%,#ffffff_42%,#f8fafc_100%)]">
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
        <div className="flex items-start gap-4 border-b border-slate-200 pb-6">
          <div className="rounded-2xl bg-sky-100 p-3">
            <Search className="h-5 w-5 text-sky-700" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-950">Search Results</h1>
            <p className="mt-2 text-slate-600">
              {query
                ? `Showing matches for "${query}"`
                : "Enter a keyword in the search bar to find research, news, and events."}
            </p>
          </div>
        </div>

      {!query ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
          Start typing in the navbar search bar and press Enter.
        </div>
      ) : (
        <>
          <ResultSection
            title="Research"
            items={filteredResearch}
            emptyLabel="No research matched your search."
            renderItem={(item) => (
              <Link
                key={item._id}
                to={`/research/${slugify(item.category)}/${slugify(item.title)}`}
                className="block rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:bg-slate-50 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                  {item.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {stripHtml(item.description).slice(0, 200)}...
                </p>
              </Link>
            )}
          />

          <ResultSection
            title="News"
            items={filteredNews}
            emptyLabel="No news matched your search."
            renderItem={(item) => (
              <Link
                key={item._id}
                to={`/news/${slugify(item.category)}/${slugify(item.title)}`}
                className="block rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:bg-slate-50 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                  {item.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {stripHtml(item.description).slice(0, 200)}...
                </p>
              </Link>
            )}
          />

          <ResultSection
            title="Events"
            items={filteredEvents}
            emptyLabel="No events matched your search."
            renderItem={(item) => (
              <Link
                key={item._id}
                to={`/events/${slugify(item.category)}/${slugify(item.title)}`}
                className="block rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:bg-slate-50 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                  {item.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {stripHtml(item.description).slice(0, 200)}...
                </p>
                <p className="mt-3 text-sm text-slate-500">{item.location}</p>
              </Link>
            )}
          />
        </>
      )}
      </div>
      </div>
    </div>
  );
};

export default SearchResults;
