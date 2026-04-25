import React, { useEffect, useState } from "react"
import { fetchEvents } from "../../features/events/eventSlice"
import { useDispatch, useSelector } from "react-redux"
import { Loader2, CalendarDays, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { slugify } from "../../utils/slugify"

const Events = () => {
  const dispatch = useDispatch()
  const { events = [], loading } = useSelector((state) => state.events)
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    dispatch(fetchEvents())
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
        <h1 className="text-4xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">Upcoming Events</h1>
        <p className="mt-4 text-gray-600 max-w-2xl">
          Join us at our upcoming events, seminars, and networking sessions.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-gray-500 py-10">No events found.</div>
      ) : (
        events.slice(0, visibleCount).map((event) => (
          <Link
            key={event._id}
            to={`/events/${slugify(event.category)}/${slugify(event.title)}`}
            className="block"
          >
            <div className="flex flex-col md:flex-row gap-8 border pb-8 hover:shadow-md p-6 rounded-xl transition bg-white">
              <div className="md:w-[320px] shrink-0">
                <img
                  src={event.image?.url}
                  alt={event.title}
                  className="rounded-xl object-cover w-full h-52 border"
                />
              </div>

              <div className="flex flex-col gap-4 flex-1">
                <div className="bg-blue-50 text-blue-700 w-fit px-4 py-2 rounded-lg font-bold flex flex-col items-center justify-center">
                  <span className="text-sm uppercase tracking-widest">{new Date(event.eventDate).toLocaleDateString("en-US", { month: "short" })}</span>
                  <span className="text-2xl">{new Date(event.eventDate).toLocaleDateString("en-US", { day: "2-digit" })}</span>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mt-2 hover:text-blue-600">
                  {event.title}
                </h2>

                <p className="text-gray-600 leading-relaxed line-clamp-2 mt-1">
                  {event.description
                    ?.replace(/<[^>]+>/g, "")
                    .slice(0, 180)}...
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-blue-500" />
                    <span>
                      {new Date(event.eventDate).toLocaleDateString("en-GB", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}

      {/* View More */}
      {visibleCount < events.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 20)}
            className="px-6 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            Load More Events
          </button>
        </div>
      )}
    </div>
  )
}

export default Events
