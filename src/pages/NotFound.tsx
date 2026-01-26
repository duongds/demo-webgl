import { Home } from 'lucide-react'
import { Link } from 'react-router'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
            {/* Glitch Effect Title */}
            <div className="relative mb-8">
                <h1 className="text-[12rem] md:text-[16rem] font-extralight tracking-[0.1em] text-white/10 select-none">
                    404
                </h1>
                <h1 className="absolute inset-0 flex items-center justify-center text-[12rem] md:text-[16rem] font-extralight tracking-[0.1em] text-white/20 animate-pulse">
                    404
                </h1>
            </div>

            <h2 className="text-2xl md:text-3xl font-extralight tracking-[0.3em] uppercase mb-4">
                Page Not Found
            </h2>

            <p className="text-white/40 text-center max-w-md mb-12">
                The page you're looking for doesn't exist or has been moved to another dimension.
            </p>

            <Link
                to="/"
                className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm uppercase tracking-widest">Return to Gallery</span>
            </Link>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[128px]" />
            </div>
        </div>
    )
}

export default NotFound
