import React, { useEffect, useState } from "react"
import { fetchNews } from "../../features/news/newsSlice"
import { useDispatch, useSelector } from "react-redux"
import { Loader2, CalendarDays } from "lucide-react"
import { Link } from "react-router-dom"
import { slugify } from "../../utils/slugify"

const News = () => {
  const dispatch = useDispatch()
  const { newsList = [], loading } = useSelector((state) => state.news)
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    dispatch(fetchNews())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">Latest News</h1>
        <p className="mt-4 text-gray-600 max-w-2xl">
          Stay updated with our latest announcements, press releases, and general updates.
        </p>
      </div>

      {newsList.length === 0 ? (
        <div className="text-gray-500 py-10">No news articles found.</div>
      ) : (
        newsList.slice(0, visibleCount).map((item) => (
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
                  className="rounded-xl object-cover w-full h-52 shadow-sm"
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

                <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600">
                  {item.title}
                </h2>

                <p className="text-gray-600 leading-relaxed line-clamp-3 mt-2">
                  {item.description
                    ?.replace(/<[^>]+>/g, "")
                    .slice(0, 180)}...
                </p>

                <div className="flex items-center gap-4 mt-auto pt-4">
                  <span className="uppercase text-xs tracking-wide text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                    {item.category || "General"}
                  </span>
                  {item.readTime && (
                    <span className="text-xs text-gray-500">{item.readTime}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))
      )}

      {/* View More */}
      {visibleCount < newsList.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 20)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            See More
          </button>
        </div>
      )}
    </div>
  )
}

export default News
