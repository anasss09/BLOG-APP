import { useDeferredValue, useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Menu, Search } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../../features/auth/authSlice";
import { fetchResearch } from "../../features/research/researchSlice";
import { fetchNews } from "../../features/news/newsSlice";
import { fetchEvents } from "../../features/events/eventSlice";
import { researchAreas } from '../../config/menuConfig'
import { getSearchSuggestions } from "../../utils/search";

export default function Navbar({ navLinks }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const user = useSelector((state) => state.auth.user);
  const { blogs = [], loading: researchLoading } = useSelector(
    (state) => state.research
  );
  const { newsList = [], loading: newsLoading } = useSelector(
    (state) => state.news
  );
  const { events = [], loading: eventsLoading } = useSelector(
    (state) => state.events
  );
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/search") {
      const query = new URLSearchParams(location.search).get("q") || "";
      setSearchQuery(query);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const query = deferredSearchQuery.trim();

    if (!query) return;

    if (!blogs.length) dispatch(fetchResearch());
    if (!newsList.length) dispatch(fetchNews());
    if (!events.length) dispatch(fetchEvents());
  }, [
    blogs.length,
    deferredSearchQuery,
    dispatch,
    events.length,
    newsList.length,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    setIsSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const quickSuggestions = getSearchSuggestions({
    query: deferredSearchQuery,
    blogs,
    newsList,
    events,
    limit: 7,
  });

  const shouldShowSuggestions =
    isSearchFocused && deferredSearchQuery.trim().length > 0;

  const searchLoading =
    (researchLoading && blogs.length === 0) ||
    (newsLoading && newsList.length === 0) ||
    (eventsLoading && events.length === 0);

  const handleSuggestionClick = (path) => {
    setIsSearchFocused(false);
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-700">
            MyBlog
          </span>
          <span className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
            Foundation
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-1">

              {/* Research */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-sm font-medium">
                  <Link
                    to='/research'
                    className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
                  >
                    Research
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <ul className="divide-y divide-slate-200">

                      {researchAreas.map((area) => (
                        <Link key={area.slug} to={`/research/${area.slug}`}>
                          <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">
                            {area.name}
                          </li>
                        </Link>
                      ))}

                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Events */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-sm font-medium">
                  <Link
                    to='/events'
                    className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
                  >
                    Events
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <ul className="divide-y divide-slate-200">
                      <Link to='/events/conclave'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Conclave</li>
                      </Link>
                      <Link to='/events/conference'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Conference</li>
                      </Link>
                      <Link to='/events/workshop'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Workshop</li>
                      </Link>
                      <Link to='/events/roundtables'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Roundtables</li>
                      </Link>
                      <Link to='/events/track-ii-dialogues'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Track-II Dialogues</li>
                      </Link>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* News */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-sm font-medium">
                  <Link
                    to='/news'
                    className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
                  >
                    News
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <ul className="divide-y divide-slate-200">
                      <Link to='/news/general'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">General</li>
                      </Link>
                      <Link to='/news/press-release'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Press Release</li>
                      </Link>
                      <Link to='/news/announcement'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Announcement</li>
                      </Link>
                      <Link to='/news/company'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Company</li>
                      </Link>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Membership */}
              <NavigationMenuItem>
                {/* <NavigationMenuTrigger > */}

                  <Link
                    to='/menbership'
                    className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
                  >
                    Membership
                  </Link>
                {/* </NavigationMenuTrigger> */}
                {/* <NavigationMenuContent>
                  <div className="w-64 bg-[#fff] p-6 text-black shadow-xl"></div>
                </NavigationMenuContent> */}
              </NavigationMenuItem>

              {/* About */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-sm font-medium">
                  <Link
                    to='/about'
                    className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
                  >
                    About Us
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <ul className="divide-y divide-slate-200">
                      <Link to='/about/leadership'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Leadership</li>
                      </Link>
                      <Link to='/about/mission'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Mission</li>
                      </Link>
                      <Link to='/about/our-team'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Our Team</li>
                      </Link>
                      <Link to='/about/careers'>
                        <li className="cursor-pointer px-6 py-3 transition hover:bg-slate-50">Careers</li>
                      </Link>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

          {/* Donate Button */}
          <Link to="/membership">
            <Button className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
              Join Us
            </Button>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative"
            ref={searchRef}
          >
            <button
              type="submit"
              className="absolute left-3 top-2.5 text-slate-400"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <Input
              placeholder="Search..."
              className="h-10 w-60 rounded-full border-slate-200 bg-slate-50 pl-10 shadow-none focus-visible:border-sky-200 focus-visible:ring-sky-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />

            {shouldShowSuggestions && (
              <div className="absolute top-full mt-3 w-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="border-b bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Suggestions
                </div>

                {searchLoading ? (
                  <div className="px-4 py-6 text-sm text-slate-500">
                    Loading suggestions...
                  </div>
                ) : quickSuggestions.length > 0 ? (
                  <>
                    <div className="max-h-96 overflow-y-auto">
                      {quickSuggestions.map((item) => (
                        <button
                          key={`${item.type}-${item.id}`}
                          type="button"
                          onClick={() => handleSuggestionClick(item.path)}
                          className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <div className="mt-1 rounded-full bg-sky-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-800">
                            {item.type}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {item.category}
                              {item.meta ? ` • ${item.meta}` : ""}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Show all results for "{deferredSearchQuery.trim()}"
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-6 text-sm text-slate-500">
                    No quick matches found. Press Enter to search everything.
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link to="/login">
              <Button variant="ghost" className="rounded-full text-slate-700 hover:bg-slate-100">Login</Button>
              </Link>

              <Link to="/register">
                <Button variant="outline" className="rounded-full border-slate-200">Register</Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full border-slate-200"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <Menu />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-2xl border border-slate-200 bg-white shadow-2xl">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.name} asChild>
                  <Link to={link.path}>{link.name}</Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem asChild>
                <Link to="/membership">Join Us</Link>
              </DropdownMenuItem>


              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="rounded-full">Login</Button>
                  </Link>

                  <Link to="/register">
                    <Button variant="outline" className="rounded-full">Register</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => dispatch(logoutUser())}
                  >
                    Logout
                  </Button>
                </>
              )}

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
