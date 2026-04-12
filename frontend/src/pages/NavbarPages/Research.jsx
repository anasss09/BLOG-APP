import React, { useEffect, useState } from "react"
import { fetchResearch } from "../../features/research/researchSlice"
import { useDispatch, useSelector } from "react-redux"
import { Loader2, CalendarDays } from "lucide-react"
import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";

const Research = () => {

  const dispatch = useDispatch()
  const { blogs = [], loading } = useSelector((state) => state.research)

  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    dispatch(fetchResearch())
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

      {blogs.slice(0, visibleCount).map((blog) => (

        <Link
          key={blog._id}
          to={`/research/${slugify(blog.category)}/${slugify(blog.title)}`}
          className="block"
        >
          <div className="flex flex-col md:flex-row gap-8 border-b pb-10 hover:bg-gray-50 p-4 rounded-lg transition">

            {/* Image */}
            <div className="md:w-[320px] shrink-0">
              <img
                src={blog.image?.url}
                alt={blog.title}
                className="rounded-xl object-cover w-full h-52"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3">

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CalendarDays size={16} />
                {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold hover:text-blue-600">
                {blog.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {blog.description
                  ?.replace(/<[^>]+>/g, "")
                  .slice(0, 180)}...
              </p>

              {/* Category */}
              <span className="uppercase text-xs tracking-wide text-blue-700 font-semibold">
                {blog.category || "Commentary"}
              </span>

            </div>

          </div>
        </Link>

      ))}

      {/* View More */}
      {visibleCount < blogs.length && (
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

export default Research