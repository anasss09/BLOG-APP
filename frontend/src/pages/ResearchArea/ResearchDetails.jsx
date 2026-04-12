import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { slugify } from "../../utils/slugify";
import { incrementViewCount } from "../../features/research/researchSlice";

const ResearchDetails = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();

    const { blogs = [] } = useSelector((state) => state.research);

    const hasViewed = useRef(false);

    // Find current blog
    const blog = blogs.find(
        (b) => slugify(b.title) === slug
    );

    // 🔥 Increment view count
    useEffect(() => {
        if (blog?._id && !hasViewed.current) {
            dispatch(incrementViewCount(blog._id));
            hasViewed.current = true;
        }
    }, [blog?._id]);

    // 🔥 Related blogs
    const relatedBlogs = blogs
        .filter(
            (b) =>
                b.category === blog?.category &&
                b._id !== blog?._id
        )
        .slice(0, 3);

    if (!blog) {
        return <p className="text-center py-10">Blog not found</p>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">

            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
                Home / Research /{" "}
                <span className="capitalize">{blog.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-3">
                {blog.title}
            </h1>

            {/* View Count */}
            <p className="text-sm text-gray-500 mb-4">
                👁 {blog.views || 0} views
            </p>

            {/* Image */}
            <img
                src={blog.image?.url}
                alt={blog.title}
                className="w-full h-80 object-cover rounded-xl mb-6"
            />

            {/* Content */}
            <div
                className="prose max-w-none mb-10"
                dangerouslySetInnerHTML={{ __html: blog.description }}
            />

            {/* 🔥 RELATED POSTS */}
            {relatedBlogs.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-6">
                        Related Posts
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {relatedBlogs.map((item) => (
                            <Link
                                key={item._id}
                                to={`/research/${slugify(item.category)}/${slugify(item.title)}`}
                                className="border rounded-lg p-4 hover:shadow-md transition"
                            >
                                <div>
                                        <div className="space-y-6">

                                        {relatedBlogs.map((item) => (
                                            <Link
                                                key={item._id}
                                                to={`/research/${slugify(item.category)}/${slugify(item.title)}`}
                                                className="flex gap-4 items-center hover:bg-gray-50 p-3 rounded-lg transition"
                                            >

                                                {/* Image */}
                                                <div className="w-24 h-20 shrink-0">
                                                    <img
                                                        src={item.image?.url}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="flex flex-col">

                                                    {/* Title */}
                                                    <h4 className="font-semibold text-lg leading-snug hover:text-blue-600">
                                                        {item.title}
                                                    </h4>

                                                    {/* Meta */}
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "long",
                                                        })}{" "}
                                                        • 8 mins read
                                                    </p>

                                                </div>

                                            </Link>
                                        ))}

                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ResearchDetails;