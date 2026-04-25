import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Loader2 } from "lucide-react";

import { fetchNews } from "../../features/news/newsSlice";
import { slugify } from "../../utils/slugify";

const NewsCategory = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { newsList = [], loading } = useSelector((state) => state.news);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (!loading && newsList.length === 0) {
      dispatch(fetchNews());
    }
  }, [dispatch, loading, newsList.length]);

  const filteredNews = newsList.filter(
    (item) => slugify(item.category) === category
  );

  if (loading && newsList.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {category.replace(/-/g, " ")}
      </h1>

      {filteredNews.length === 0 ? (
        <p className="text-gray-500">No news found in this category.</p>
      ) : (
        <>
          <div className="space-y-10">
            {filteredNews.slice(0, visibleCount).map((item) => (
              <Link
                key={item._id}
                to={`/news/${slugify(item.category)}/${slugify(item.title)}`}
                className="block"
              >
                <div className="flex flex-col md:flex-row gap-8 border-b pb-10 hover:bg-gray-50 p-4 rounded-lg transition">
                  <div className="md:w-[320px] shrink-0">
                    <img
                      src={item.image?.url}
                      alt={item.title}
                      className="rounded-xl object-cover w-full h-52"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <CalendarDays size={16} />
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    <h2 className="text-2xl font-semibold hover:text-blue-600">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {item.description
                        ?.replace(/<[^>]+>/g, "")
                        .slice(0, 180)}
                      ...
                    </p>

                    <span className="uppercase text-xs tracking-wide text-blue-700 font-semibold">
                      {item.category || "General"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleCount < filteredNews.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsCategory;
