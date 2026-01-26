import { ArrowLeft, Github, Mail, Twitter } from 'lucide-react'
import { Link } from 'react-router'

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1a] to-[#0a0a0a] text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm uppercase tracking-widest">Back to Gallery</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center min-h-screen px-6 py-24">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-6xl md:text-8xl font-extralight tracking-[0.2em] uppercase mb-4">
                        About
                    </h1>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto" />
                </div>

                {/* Content Card */}
                <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-light mb-6 tracking-wide">
                        Three.js Learning Project
                    </h2>

                    <p className="text-white/60 leading-relaxed mb-6">
                        This project is a learning journey into the world of WebGL and Three.js.
                        Inspired by creative websites like{' '}
                        <a
                            href="https://thevertmenthe.dault-lafon.fr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                        >
                            TheVertMenthe
                        </a>
                        , this interactive gallery showcases the capabilities of modern web 3D graphics.
                    </p>

                    <p className="text-white/60 leading-relaxed mb-8">
                        Built with React, Three.js, React Three Fiber, and Drei,
                        this project demonstrates character movement, camera systems,
                        interactive UI, and smooth transitions.
                    </p>

                    {/* Tech Stack */}
                    <div className="mb-8">
                        <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4">
                            Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Three.js', 'R3F', 'Drei', 'Zustand', 'GSAP', 'Tailwind'].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4 pt-6 border-t border-white/10">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="mailto:hello@example.com"
                            className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </main>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
            </div>
        </div>
    )
}

export default About
