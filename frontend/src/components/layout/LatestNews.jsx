import React, { useEffect, useState } from 'react'
import { fetchResearch } from '../../features/research/researchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom';
import { slugify } from "../../utils/slugify";

const LatestNews = () => {

    const dispatch = useDispatch();
    const { blogs = [], loading } = useSelector((state) => state.research)
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        dispatch(fetchResearch());
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
                <h2 className="text-3xl font-semibold">Latest news</h2>
                <Link to="/research" className="text-blue-600 hover:underline font-medium">Explore our content →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {blogs.slice(0, visibleCount).map((blog) => (
                    <Link
                        key={blog._id}
                        to={`/research/${slugify(blog.category)}/${slugify(blog.title)}`}
                        className="block"
                    >
                        <Card className="overflow-hidden rounded-xl p-0 hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer">

                            {/* Image */}
                            <img
                                src={blog.image?.url}
                                alt={blog.title}
                                className="h-32 w-full object-cover"
                            />

                            <CardHeader className="p-3">
                                <Badge variant="secondary" className="w-fit mb-2 uppercase text-xs">
                                    {blog.category || "Insights Papers"}
                                </Badge>

                                <h3 className="text-sm font-semibold line-clamp-2">
                                    {blog.title}
                                </h3>
                            </CardHeader>

                            <CardContent className="text-[11px] px-3 pb-3">
                                <div className="flex items-center gap-4">
                                    <span>
                                        {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        ⏱ {blog.readTime || "Long Read"}
                                    </span>
                                </div>
                            </CardContent>

                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default LatestNews