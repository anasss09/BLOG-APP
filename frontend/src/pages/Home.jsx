// import React from 'react'
// import Hero from '../components/layout/Hero';
// import LatestNews from '../components/layout/LatestNews';

// const Home = () => {
//     return (
//         <div>
//             <Hero />
//             <div className='bg-gray-200'>
//                 <LatestNews />
//             </div>
//         </div>
//     )
// }

// export default Home

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchResearch } from "../features/research/researchSlice";
import { fetchNews } from "../features/news/newsSlice";
import { fetchEvents } from "../features/events/eventSlice";
import { slugify } from "../utils/slugify";

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, "").trim();

const formatDate = (value, options = {}) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });

const Home = () => {
  const dispatch = useDispatch();
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
    dispatch(fetchResearch());
    dispatch(fetchNews());
    dispatch(fetchEvents());
  }, [dispatch]);

  const sortedResearch = [...blogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const sortedNews = [...newsList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
  );

  const featuredResearch =
    sortedResearch.find((item) => item.featured) || sortedResearch[0];
  const latestNews = sortedNews.slice(0, 3);
  const upcomingEvents = sortedEvents
    .filter((item) => new Date(item.eventDate) >= new Date())
    .slice(0, 3);
  const eventCards = upcomingEvents.length > 0 ? upcomingEvents : sortedEvents.slice(0, 3);

  const topicMap = sortedResearch.reduce((acc, item) => {
    if (!item.category) return acc;

    if (!acc[item.category]) {
      acc[item.category] = {
        name: item.category,
        count: 0,
        slug: slugify(item.category),
      };
    }

    acc[item.category].count += 1;
    return acc;
  }, {});

  const featuredTopics = Object.values(topicMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const isLoading =
    (researchLoading && sortedResearch.length === 0) ||
    (newsLoading && sortedNews.length === 0) ||
    (eventsLoading && sortedEvents.length === 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_18%,#ffffff_45%,#f8fafc_100%)] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.12),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-12 md:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:py-16">
          <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
            <div className="grid min-h-[480px] lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col justify-between p-8 md:p-10">
                <div className="space-y-5">
                  <Badge className="rounded-full bg-white/10 px-4 py-1 text-white hover:bg-white/10">
                    Featured Research / Articles
                  </Badge>
                  <div className="space-y-4">
                    <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
                      {featuredResearch?.title || "Fresh analysis for a rapidly changing world."}
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                      {featuredResearch
                        ? stripHtml(featuredResearch.description).slice(0, 220) + "..."
                        : "Explore research, briefings, and expert perspectives across geopolitics, technology, climate, and global institutions."}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                    <span>{featuredResearch?.category || "Research Brief"}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                    <span>
                      {featuredResearch?.createdAt
                        ? formatDate(featuredResearch.createdAt)
                        : "Newly published"}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                    <span>{featuredResearch?.readTime || "Deep dive"}</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" className="rounded-full px-6">
                      <Link
                        to={
                          featuredResearch
                            ? `/research/${slugify(featuredResearch.category)}/${slugify(featuredResearch.title)}`
                            : "/research"
                        }
                      >
                        Read Featured Article
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white hover:text-slate-950"
                    >
                      <Link to="/research">Browse All Research</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[280px]">
                <img
                  src={
                    featuredResearch?.image?.url ||
                    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={featuredResearch?.title || "Featured research"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-sky-700">
                <Sparkles className="h-4 w-4" />
                Editorial Focus
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Big ideas, timely reporting, and practical context.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                The homepage now spotlights research, news, topics, and events in one reading flow so visitors can scan quickly and go deeper where they want.
              </p>
            </div>

            <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-300">
                Current Snapshot
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-3xl font-semibold">{sortedResearch.length}</p>
                  <p className="mt-1 text-sm text-slate-300">Research pieces</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-3xl font-semibold">{sortedNews.length}</p>
                  <p className="mt-1 text-sm text-slate-300">News updates</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-3xl font-semibold">{sortedEvents.length}</p>
                  <p className="mt-1 text-sm text-slate-300">Events listed</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-3xl font-semibold">{featuredTopics.length}</p>
                  <p className="mt-1 text-sm text-slate-300">Featured topics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Latest News
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              What’s shaping the conversation right now
            </h2>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-sky-700"
          >
            View all news
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {latestNews.length > 0 ? (
            latestNews.map((item) => (
              <Link
                key={item._id}
                to={`/news/${slugify(item.category || "general")}/${slugify(item.title)}`}
                className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={
                    item.image?.url ||
                    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={item.title}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {item.category || "General"}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-slate-900">
                    {item.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {stripHtml(item.description).slice(0, 150)}...
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 className="h-4 w-4" />
                    <span>{item.readTime || "Quick briefing"}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-slate-500 lg:col-span-3">
              No news articles available yet.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Featured Topics
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Explore the themes readers return to most
            </h2>
          </div>
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-sky-700"
          >
            Explore research library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredTopics.length > 0 ? (
            featuredTopics.map((topic, index) => (
              <Link
                key={topic.slug}
                to={`/research/${topic.slug}`}
                className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-4xl font-semibold text-slate-200">
                    0{index + 1}
                  </span>
                  <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-100">
                    {topic.count} articles
                  </Badge>
                </div>
                <h3 className="mt-10 text-xl font-semibold leading-snug text-slate-900">
                  {topic.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Dive into curated analysis, ongoing debates, and long-form coverage in this focus area.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky-700">
                  Open topic
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-slate-500 md:col-span-2 xl:col-span-4">
              Topics will appear here as research articles are published.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Upcoming Events
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Join briefings, roundtables, and live conversations
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-sky-700"
          >
            View all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {eventCards.length > 0 ? (
            eventCards.map((event) => (
              <Link
                key={event._id}
                to={`/events/${slugify(event.category || "event")}/${slugify(event.title)}`}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={
                    event.image?.url ||
                    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={event.title}
                  className="h-52 w-full object-cover"
                />
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <Badge className="rounded-full bg-sky-100 px-3 py-1 text-sky-800 hover:bg-sky-100">
                      {event.category || "Event"}
                    </Badge>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-700">
                      <div>{formatDate(event.eventDate, { month: "short" }).split(" ")[1]}</div>
                      <div className="text-lg leading-none">
                        {new Date(event.eventDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold leading-snug text-slate-900">
                    {event.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {stripHtml(event.description).slice(0, 150)}...
                  </p>

                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {new Date(event.eventDate).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-slate-500 lg:col-span-3">
              No events available yet.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
          <div className="grid gap-8 px-8 py-10 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                Call to Action
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
                Help us expand the reach of independent research and public dialogue.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Become a member for deeper access, or donate to support the reporting, events, and analysis that keep this platform growing.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link to="/membership">Become a Member</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white hover:text-slate-950"
                >
                  <Link to="/donate">Donate to Support</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/5 p-5">
                <Users className="h-6 w-6 text-sky-300" />
                <h3 className="mt-4 text-lg font-semibold">Membership</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Access premium reports, member-only updates, and early invitations to upcoming events.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/5 p-5">
                <Sparkles className="h-6 w-6 text-sky-300" />
                <h3 className="mt-4 text-lg font-semibold">Donate</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Fund original research, support editorial independence, and help us host more public conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
