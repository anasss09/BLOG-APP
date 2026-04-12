import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";


const ResearchCategory = () => {
  const { category } = useParams();

  const { blogs = [], loading } = useSelector(
    (state) => state.research
  );

  const [visibleCount, setVisibleCount] = useState(10);

  // Filter blogs based on slug
  const filteredBlogs = blogs.filter((blog) => {
    const blogSlug = blog.category
      ?.toLowerCase()
      .replace(/&/g, "")
      .replace(/\s+/g, "-");

    return blogSlug === category;
  });

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {category.replace(/-/g, " ")}
      </h1>

      {/* No Data */}
      {filteredBlogs.length === 0 ? (
        <p className="text-gray-500">No blogs found</p>
      ) : (
        <>
          {/* Blog List */}
          <div className="space-y-10">

            {filteredBlogs.slice(0, visibleCount).map((blog) => (
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

          </div>

          {/* Load More */}
          {visibleCount < filteredBlogs.length && (
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

export default ResearchCategory;