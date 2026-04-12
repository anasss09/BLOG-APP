import { Button } from "@/components/ui/button"

export default function Hero() {
    // Dynamic featured content (future me API se aa sakta hai)
    const featured = {
        category: "Analysis",
        title: "Four Years On – Lessons from Modern Security Conflicts",
        description:
            "Expert insights on evolving global defence strategy, geopolitics, and emerging security challenges shaping the world today.",
        date: "2 Feb 2026",
        image:
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
    }

    return (
        <section className="relative w-full h-[85vh] mt-8 flex items-center">

            {/* Background Image */}
            <img
                src={featured.image}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative container mx-auto px-6 text-white max-w-3xl">

                {/* Category */}
                {/* <span className="inline-block bg-primary px-3 py-1 text-xs rounded mb-4">
                    {featured.category}
                </span> */}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {featured.title}
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-200 mb-6">
                    {featured.description}
                </p>

                {/* Date */}
                <p className="text-sm text-gray-300 mb-6">
                    Published: {featured.date}
                </p>

                {/* Buttons */}
                <div className="flex gap-4">
                    <Button size="lg">Read Full Report</Button>
                    <Button size="lg" variant="outline" className="text-white bg-black border-black hover:bg-white hover:text-black">
                        Explore Research
                    </Button>
                </div>
            </div>
        </section>
    )
}
