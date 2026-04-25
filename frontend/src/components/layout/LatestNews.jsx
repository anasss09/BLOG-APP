import React, { useEffect, useState } from 'react'
import { fetchNews } from '../../features/news/newsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom';
import { slugify } from "../../utils/slugify";

const LatestNews = () => {

    const dispatch = useDispatch();
    const { newsList = [], loading } = useSelector((state) => state.news)
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        dispatch(fetchNews());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-3xl font-semibold">Latest News</h2>
                <Link to="/news" className="text-blue-600 hover:underline font-medium">Explore all news →</Link>
            </div>

            {newsList.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No news available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newsList.slice(0, visibleCount).map((news) => (
                        <Link
                            key={news._id}
                            to={`/news/${slugify(news.title)}`}
                            className="block group"
                        >
                            <Card className="overflow-hidden rounded-xl p-0 hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer h-full border border-gray-200">
                                
                                {/* Image */}
                                <img
                                    src={news.image?.url || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800"}
                                    alt={news.title}
                                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                <CardHeader className="p-4 pb-2">
                                    <Badge variant="secondary" className="w-fit mb-2 uppercase text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200">
                                        News Update
                                    </Badge>

                                    <h3 className="text-base font-bold line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        {news.title}
                                    </h3>
                                </CardHeader>

                                <CardContent className="text-xs text-gray-500 px-4 pb-4">
                                    <div className="flex items-center gap-4 mt-2">
                                        <span>
                                            {new Date(news.createdAt).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                        {news.readTime && (
                                            <span className="flex items-center gap-1">
                                                ⏱ {news.readTime} read
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    )
}

export default LatestNews