import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Loader2, MapPin } from "lucide-react";

import {
  fetchEvents,
  incrementEventViewCount,
} from "../../features/events/eventSlice";
import { slugify } from "../../utils/slugify";

const EventDetails = () => {
  const { category, slug } = useParams();
  const dispatch = useDispatch();
  const { events = [], loading } = useSelector((state) => state.events);
  const hasViewed = useRef(false);

  useEffect(() => {
    if (!loading && events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, events.length, loading]);

  const event = events.find(
    (item) =>
      slugify(item.category) === category && slugify(item.title) === slug
  );

  useEffect(() => {
    if (event?._id && !hasViewed.current) {
      dispatch(incrementEventViewCount(event._id));
      hasViewed.current = true;
    }
  }, [dispatch, event?._id]);

  const relatedEvents = events
    .filter(
      (item) => item.category === event?.category && item._id !== event?._id
    )
    .slice(0, 3);

  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!event) {
    return <p className="text-center py-10">Event not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-sm text-gray-500 mb-4">
        Home / Events / <span className="capitalize">{event.category}</span>
      </div>

      <h1 className="text-4xl font-bold mb-3">{event.title}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>
            {new Date(event.eventDate).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
        <span>{event.views || 0} views</span>
      </div>

      <img
        src={event.image?.url}
        alt={event.title}
        className="w-full h-80 object-cover rounded-xl mb-6"
      />

      <div
        className="prose max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: event.description }}
      />

      {relatedEvents.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-6">Related Events</h3>

          <div className="space-y-6">
            {relatedEvents.map((item) => (
              <Link
                key={item._id}
                to={`/events/${slugify(item.category)}/${slugify(item.title)}`}
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
                    {new Date(item.eventDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
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

export default EventDetails;
