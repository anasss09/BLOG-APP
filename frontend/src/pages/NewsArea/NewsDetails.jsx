import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

import {
  fetchNews,
  incrementNewsViewCount,
} from "../../features/news/newsSlice";
import { slugify } from "../../utils/slugify";

const NewsDetails = () => {
  const { category, slug } = useParams();
  const dispatch = useDispatch();
  const { newsList = [], loading } = useSelector((state) => state.news);
  const hasViewed = useRef(false);

  useEffect(() => {
    if (!loading && newsList.length === 0) {
      dispatch(fetchNews());
    }
  }, [dispatch, loading, newsList.length]);

  const article = newsList.find(
    (item) =>
      slugify(item.category) === category && slugify(item.title) === slug
  );

  useEffect(() => {
    if (article?._id && !hasViewed.current) {
      dispatch(incrementNewsViewCount(article._id));
      hasViewed.current = true;
    }
  }, [article?._id, dispatch]);

  const relatedNews = newsList
    .filter(
      (item) => item.category === article?.category && item._id !== article?._id
    )
    .slice(0, 3);

  if (loading && newsList.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!article) {
    return <p className="text-center py-10">News article not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-sm text-gray-500 mb-4">
        Home / News / <span className="capitalize">{article.category}</span>
      </div>

      <h1 className="text-4xl font-bold mb-3">{article.title}</h1>

      <p className="text-sm text-gray-500 mb-4">
        {new Date(article.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
        {" • "}
        {article.readTime || "Quick briefing"}
        {" • "}
        {article.views || 0} views
      </p>

      <img
        src={article.image?.url}
        alt={article.title}
        className="w-full h-80 object-cover rounded-xl mb-6"
      />

      <div
        className="prose max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: article.description }}
      />

      {relatedNews.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-6">Related News</h3>

          <div className="space-y-6">
            {relatedNews.map((item) => (
              <Link
                key={item._id}
                to={`/news/${slugify(item.category)}/${slugify(item.title)}`}
                className="flex gap-4 items-center hover:bg-gray-50 p-3 rounded-lg transition"
              >
                <div className="w-24 h-20 shrink-0">
                  <img
                    src={item.image?.url}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <h4 className="font-semibold text-lg leading-snug hover:text-blue-600">
                    {item.title}
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                    })}
                    {" • "}
                    {item.readTime || "Quick briefing"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetails;
