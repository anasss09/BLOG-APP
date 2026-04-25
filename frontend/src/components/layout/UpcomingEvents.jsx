import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../features/events/eventSlice';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const UpcomingEvents = () => {
    const dispatch = useDispatch();
    const { events = [], loading } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    // Show only the 3 most recent/upcoming events
    const displayEvents = events.slice(0, 3);

    return (
        <section className="bg-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            Join our experts for discussions on pressing global issues, book launches, and policy debates.
                        </p>
                    </div>
                    <Link to="/events" className="mt-4 md:mt-0">
                        <Button variant="outline" className="flex items-center gap-2">
                            View All Events <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : displayEvents.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No upcoming events</h3>
                        <p className="text-gray-500">Check back later for new events and discussions.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {displayEvents.map((event) => {
                            const eventDate = new Date(event.date || event.createdAt);
                            const month = eventDate.toLocaleString('default', { month: 'short' });
                            const day = eventDate.getDate();

                            return (
                                <Link to={`/events/${event._id}`} key={event._id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img 
                                            src={event.image?.url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"} 
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur shadow-sm rounded-lg text-center px-3 py-2 min-w-[60px]">
                                            <div className="text-red-600 font-bold text-sm uppercase">{month}</div>
                                            <div className="text-gray-900 font-black text-xl">{day}</div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded border border-red-100">
                                                {event.type || "Webinar"}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>
                                        
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow">
                                            {event.description?.replace(/<[^>]+>/g, '') || "Join us for this insightful event exploring key themes and topics."}
                                        </p>

                                        <div className="space-y-2 mt-auto">
                                            <div className="flex items-center text-gray-500 text-sm gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>{event.time || "14:00 - 15:30 GMT"}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span>{event.location || "Online"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default UpcomingEvents;
