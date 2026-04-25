import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronUp } from "lucide-react";

import { researchAreas } from "../../config/menuConfig";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Research", path: "/research" },
  { name: "News", path: "/news" },
  { name: "Events", path: "/events" },
  { name: "Membership", path: "/membership" },
  { name: "About", path: "/about" },
  { name: "Search", path: "/search" },
];

const newsLinks = [
  { name: "General", path: "/news/general" },
  { name: "Press Release", path: "/news/press-release" },
  { name: "Announcement", path: "/news/announcement" },
  { name: "Company", path: "/news/company" },
];

const eventLinks = [
  { name: "Conclave", path: "/events/conclave" },
  { name: "Conference", path: "/events/conference" },
  { name: "Workshop", path: "/events/workshop" },
  { name: "Roundtable", path: "/events/roundtable" },
  { name: "Track-II Dialogue", path: "/events/track-ii" },
];

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div>
              <Link to="/" className="text-3xl font-semibold leading-tight text-white">
                MYBLOG
                <br />
                FOUNDATION
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
                Independent research, timely news, and public events in one place.
                The footer now only keeps routes that actually work inside the app.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/membership"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
              >
                Become a Member
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Search Content
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="transition hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Research Areas</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {researchAreas.map((item) => (
                <li key={item.slug}>
                  <Link to={item.path} className="transition hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">News</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {newsLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="transition hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Events</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {eventLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="transition hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} MyBlog Foundation. All footer links are live routes.</p>

          <button
            onClick={scrollTop}
            className="inline-flex items-center gap-1 transition hover:text-white"
          >
            <ChevronUp size={16} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
