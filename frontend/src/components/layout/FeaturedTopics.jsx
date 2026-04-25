import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, TrendingUp, Globe2, BookOpen, Leaf, Cpu } from 'lucide-react';

const FeaturedTopics = () => {
    const topics = [
        {
            title: "Global Security",
            description: "Analysis of international conflicts and defense strategies.",
            icon: Shield,
            color: "text-red-500",
            bg: "bg-red-50",
            path: "/research/security"
        },
        {
            title: "Economic Policy",
            description: "Trends in global markets, trade, and economic development.",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            path: "/research/economics"
        },
        {
            title: "Geopolitics",
            description: "Shifting alliances and international relations.",
            icon: Globe2,
            color: "text-blue-500",
            bg: "bg-blue-50",
            path: "/research/geopolitics"
        },
        {
            title: "Technology & Cyber",
            description: "Impact of emerging tech and cybersecurity challenges.",
            icon: Cpu,
            color: "text-purple-500",
            bg: "bg-purple-50",
            path: "/research/technology"
        },
        {
            title: "Environment & Climate",
            description: "Sustainable development and climate policy research.",
            icon: Leaf,
            color: "text-green-500",
            bg: "bg-green-50",
            path: "/research/environment"
        },
        {
            title: "Society & Governance",
            description: "Public policy, human rights, and social development.",
            icon: BookOpen,
            color: "text-amber-500",
            bg: "bg-amber-50",
            path: "/research/society"
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Topics</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Explore our in-depth research and expert analysis across critical global issues shaping our world today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => (
                    <Link key={index} to={topic.path} className="block group">
                        <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-200 group-hover:border-gray-300 bg-white">
                            <CardContent className="p-6">
                                <div className={`${topic.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <topic.icon className={`w-7 h-7 ${topic.color}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {topic.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {topic.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FeaturedTopics;
