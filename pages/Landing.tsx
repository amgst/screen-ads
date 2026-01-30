
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Monitor,
    Zap,
    Globe,
    Calendar,
    Shield,
    TrendingUp,
    ArrowRight,
    Check,
    Building2,
    ShoppingBag,
    GraduationCap,
    Hotel,
    Factory,
    Stethoscope
} from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <Monitor size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">LuminaSign</span>
                    </div>
                    <Link
                        to="/admin"
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                        Launch Dashboard
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center space-x-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
                        <Zap size={16} className="text-blue-400" />
                        <span className="text-sm text-blue-400 font-semibold">Cloud-Based Digital Signage</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight">
                        Transform Any Screen<br />Into Dynamic Signage
                    </h1>

                    <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Manage unlimited displays from one powerful dashboard. Update content instantly,
                        schedule playlists, and engage your audience with stunning visual experiences.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/admin"
                            className="group bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center space-x-2"
                        >
                            <span>Get Started Free</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/player"
                            className="bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-700"
                        >
                            View Player Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-slate-400 text-lg">Everything you need to manage digital signage at scale</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Globe className="text-blue-400" size={32} />}
                            title="Cloud-Based Control"
                            description="Manage all your screens from anywhere with internet access. No on-premise servers required."
                        />
                        <FeatureCard
                            icon={<Calendar className="text-purple-400" size={32} />}
                            title="Smart Scheduling"
                            description="Display different content at different times. Perfect for breakfast vs. dinner menus or business hours."
                        />
                        <FeatureCard
                            icon={<Zap className="text-yellow-400" size={32} />}
                            title="Real-Time Updates"
                            description="Changes appear instantly across all connected displays. Update once, deploy everywhere."
                        />
                        <FeatureCard
                            icon={<Monitor className="text-green-400" size={32} />}
                            title="Easy Pairing"
                            description="Connect new screens in seconds with our simple 6-digit pairing code system."
                        />
                        <FeatureCard
                            icon={<Shield className="text-red-400" size={32} />}
                            title="Secure & Reliable"
                            description="Built on Firebase infrastructure with enterprise-grade security and 99.9% uptime."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="text-indigo-400" size={32} />}
                            title="Unlimited Scalability"
                            description="From one screen to thousands. Our platform grows with your business needs."
                        />
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Built For Every Industry</h2>
                        <p className="text-slate-400 text-lg">Trusted by businesses across multiple sectors</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <UseCaseCard
                            icon={<Building2 size={28} />}
                            title="Corporate Offices"
                            description="Internal communications, KPIs, and employee engagement"
                        />
                        <UseCaseCard
                            icon={<ShoppingBag size={28} />}
                            title="Retail Stores"
                            description="Promotions, product videos, and seasonal campaigns"
                        />
                        <UseCaseCard
                            icon={<GraduationCap size={28} />}
                            title="Education"
                            description="Campus announcements, event calendars, and emergency alerts"
                        />
                        <UseCaseCard
                            icon={<Hotel size={28} />}
                            title="Hospitality"
                            description="Lobby displays, conference schedules, and local attractions"
                        />
                        <UseCaseCard
                            icon={<Stethoscope size={28} />}
                            title="Healthcare"
                            description="Waiting room content, wayfinding, and health information"
                        />
                        <UseCaseCard
                            icon={<Factory size={28} />}
                            title="Manufacturing"
                            description="Safety metrics, production targets, and shift schedules"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Join thousands of businesses using LuminaSign to power their digital displays
                    </p>
                    <Link
                        to="/admin"
                        className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-2xl"
                    >
                        <span>Start Your Free Trial</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-800">
                <div className="max-w-7xl mx-auto text-center text-slate-500">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <Monitor size={14} className="text-white" />
                        </div>
                        <span className="font-bold text-white">LuminaSign</span>
                    </div>
                    <p className="text-sm">© 2026 LuminaSign. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all group">
        <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
);

const UseCaseCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 hover:border-slate-600 transition-all">
        <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

export default Landing;
