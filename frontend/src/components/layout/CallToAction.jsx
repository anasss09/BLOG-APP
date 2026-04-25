import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CallToAction = () => {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-blue-900">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-800 blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600 blur-3xl opacity-30"></div>
            </div>

            <div className="relative max-w-5xl mx-auto px-6 text-center text-white z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-800/80 text-blue-100 text-sm font-medium mb-6 border border-blue-700">
                    Support Our Mission
                </span>
                
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                    Independent analysis needs <br className="hidden md:block"/> independent funding.
                </h2>
                
                <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Become a member today to access exclusive research, join member-only events, and support our commitment to objective global policy analysis.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/membership">
                        <Button size="lg" className="w-full sm:w-auto bg-white text-blue-900 hover:bg-gray-100 border-none text-base font-bold px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                            Become a Member
                        </Button>
                    </Link>
                    <Link to="/donate">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-blue-900 sm:text-white border-white hover:bg-white/10 hover:text-white text-base font-semibold px-8 h-14 rounded-full transition-all">
                            Make a Donation
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
