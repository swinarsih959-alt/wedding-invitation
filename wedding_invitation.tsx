import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Calendar, Clock, Sparkles, Send, CheckCircle2, Music } from 'lucide-react';

// --- Configuration ---
const WEDDING_DATE = new Date('2026-12-25T15:00:00'); // Set future date
const COUPLE_NAMES = "Elias & Amelia";
const WEDDING_HASHTAG = "#EliasAmeliaForever";

// --- Helper: Gemini API Call ---
const formatWishWithGemini = async (rawWish) => {
    // We are using the standard fetch approach provided in the instructions for text generation.
    const apiKey = ""; // API key is provided at runtime in this environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const systemPrompt = "You are a professional wedding speechwriter and poet. Your task is to take a simple, casual wedding wish from a guest and transform it into a warm, poetic, elegant, and heartfelt message. Keep it relatively short (1-3 sentences max). Maintain the original core sentiment but elevate the language. Do not include any introductory text or quotes, just the formatted wish itself.";
    
    const payload = {
        contents: [{ parts: [{ text: `Original wish: "${rawWish}"\n\nPlease format this into a poetic wedding wish.` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('API request failed');

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text.trim();
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        return rawWish; // Fallback to original if formatting fails
    }
};

const SectionHeading = ({ children, subtitle }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
    >
        <h2 className="text-4xl md:text-5xl font-serif text-stone-800 tracking-wide mb-4">{children}</h2>
        {subtitle && <p className="text-stone-500 tracking-widest uppercase text-sm md:text-base">{subtitle}</p>}
        <div className="w-16 h-[1px] bg-stone-300 mx-auto mt-6"></div>
    </motion.div>
);

const SectionContainer = ({ children, className = "", id }) => (
    <section id={id} className={`py-24 md:py-32 px-6 md:px-12 max-w-6xl mx-auto ${className}`}>
        {children}
    </section>
);

const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-100">
            {/* Background elements */}
            <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0 flex items-center justify-center">
               {/* Abstract subtle floral/organic shape using SVG */}
               <svg className="w-full h-full max-w-3xl opacity-5 text-stone-900" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M47.7,-57.2C59.9,-46.3,66.5,-29.3,69.5,-11.6C72.5,6.1,72.1,24.5,64.2,40.5C56.3,56.5,41.1,70.1,23.3,75.1C5.5,80.1,-14.8,76.5,-30.9,67.6C-47,58.7,-58.9,44.4,-67.2,28C-75.5,11.6,-80.1,-6.9,-75,-22.6C-69.9,-38.3,-55.1,-51.2,-40.4,-61.4C-25.7,-71.6,-11.1,-79.1,3.4,-83.1C17.9,-87.1,35.6,-68.2,47.7,-57.2Z" transform="translate(100 100) scale(1.1)" />
               </svg>
            </motion.div>

            <div className="z-10 text-center px-4 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <span className="text-stone-500 uppercase tracking-[0.3em] text-sm mb-6 block">We are getting married</span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-stone-800 leading-tight mb-8">
                        Elias <br/><span className="text-stone-400 italic font-light">&amp;</span> Amelia
                    </h1>
                    <p className="text-stone-600 tracking-widest uppercase text-sm md:text-base">
                        December 25, 2026 &bull; Bali, Indonesia
                    </p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12"
                >
                    <div className="w-[1px] h-16 bg-stone-400 mx-auto animate-pulse"></div>
                </motion.div>
            </div>
        </div>
    );
};

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = WEDDING_DATE.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
    ];

    return (
        <div className="bg-stone-50 py-20 border-y border-stone-200">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex justify-center gap-4 md:gap-12">
                    {timeUnits.map((unit, index) => (
                        <div key={unit.label} className="flex flex-col items-center">
                            <motion.div 
                                key={unit.value} // Key forces re-render for animation on value change
                                initial={{ opacity: 0.5, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-serif text-stone-800 w-16 md:w-24 text-center"
                            >
                                {String(unit.value).padStart(2, '0')}
                            </motion.div>
                            <span className="text-xs md:text-sm uppercase tracking-widest text-stone-500 mt-2">{unit.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DetailsSection = () => {
    return (
        <SectionContainer id="details" className="bg-white">
            <SectionHeading subtitle="When & Where">The Details</SectionHeading>
            
            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                {/* Ceremony */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center md:text-right flex flex-col md:items-end items-center"
                >
                    <div className="mb-6 p-4 rounded-full bg-stone-50 text-stone-600">
                        <Heart size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-serif text-stone-800 mb-2">The Ceremony</h3>
                    <p className="text-stone-500 uppercase tracking-widest text-sm mb-4">3:00 PM</p>
                    <p className="text-stone-600 leading-relaxed mb-4 max-w-sm">
                        St. Augustine Chapel<br/>
                        Jalan Raya Uluwatu No. 45<br/>
                        Bali, Indonesia
                    </p>
                    <a href="#" className="inline-flex items-center text-sm tracking-wider uppercase text-stone-800 border-b border-stone-800 pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors">
                        <MapPin size={14} className="mr-2" /> View Map
                    </a>
                </motion.div>

                {/* Reception */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center md:text-left flex flex-col md:items-start items-center"
                >
                     <div className="mb-6 p-4 rounded-full bg-stone-50 text-stone-600">
                        <Music size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-serif text-stone-800 mb-2">The Reception</h3>
                    <p className="text-stone-500 uppercase tracking-widest text-sm mb-4">5:30 PM</p>
                    <p className="text-stone-600 leading-relaxed mb-4 max-w-sm">
                        Villa Khayangan Estate<br/>
                        Jalan Pantai Selatan<br/>
                        Bali, Indonesia
                    </p>
                     <a href="#" className="inline-flex items-center text-sm tracking-wider uppercase text-stone-800 border-b border-stone-800 pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors">
                        <MapPin size={14} className="mr-2" /> View Map
                    </a>
                </motion.div>
            </div>
        </SectionContainer>
    );
};

const WishlistSection = () => {
    const [name, setName] = useState('');
    const [rawWish, setRawWish] = useState('');
    const [wishes, setWishes] = useState([
        { id: 1, name: "Sarah & John", text: "May your journey together be as beautiful as the love that brought you here today. Wishing you a lifetime of joy and endless romance.", isFormatted: true },
        { id: 2, name: "The Miller Family", text: "To a lifetime of shared sunsets and whispered secrets. May your love grow deeper with every passing season.", isFormatted: true }
    ]);
    const [isFormatting, setIsFormatting] = useState(false);
    const [previewWish, setPreviewWish] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleFormat = async (e) => {
        e.preventDefault();
        if (!name.trim() || !rawWish.trim()) return;
        
        setIsFormatting(true);
        const formatted = await formatWishWithGemini(rawWish);
        setPreviewWish(formatted);
        setIsFormatting(false);
    };

    const handleConfirmSubmit = () => {
        setWishes([{ id: Date.now(), name, text: previewWish, isFormatted: true }, ...wishes]);
        setPreviewWish(null);
        setRawWish('');
        setName('');
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const handleRejectPreview = () => {
        setPreviewWish(null); // Let them edit raw wish
    };

    return (
        <SectionContainer id="wishes" className="bg-stone-50">
            <SectionHeading subtitle="Leave a Message">Guest Wishes</SectionHeading>
            
            <div className="max-w-2xl mx-auto mb-16">
                <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100 relative overflow-hidden">
                    {/* Decorative AI indicator */}
                    <div className="absolute top-0 right-0 bg-stone-100 text-stone-500 text-xs px-3 py-1 uppercase tracking-widest rounded-bl-lg flex items-center">
                        <Sparkles size={12} className="mr-1" /> AI Enhanced
                    </div>

                    <h3 className="text-xl font-serif mb-6 text-stone-800">Share your blessings</h3>
                    
                    {!previewWish && !isSubmitted && (
                        <form onSubmit={handleFormat} className="space-y-6">
                            <div>
                                <label className="block text-sm uppercase tracking-wider text-stone-500 mb-2">Your Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border-b border-stone-300 bg-transparent py-2 focus:outline-none focus:border-stone-800 transition-colors font-serif text-lg"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm uppercase tracking-wider text-stone-500 mb-2">Your Message</label>
                                <textarea 
                                    value={rawWish}
                                    onChange={(e) => setRawWish(e.target.value)}
                                    className="w-full border-b border-stone-300 bg-transparent py-2 focus:outline-none focus:border-stone-800 transition-colors resize-none h-24 font-serif text-lg"
                                    placeholder="Write a casual message, and our AI will make it poetic..."
                                    required
                                />
                                <p className="text-xs text-stone-400 mt-2 italic">Don't worry about being perfectly poetic; let our AI 'Wish Formatter' refine your words.</p>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isFormatting || !name.trim() || !rawWish.trim()}
                                className="w-full bg-stone-800 text-white uppercase tracking-widest text-sm py-4 hover:bg-stone-700 transition-colors flex justify-center items-center disabled:opacity-50"
                            >
                                {isFormatting ? (
                                    <span className="flex items-center"><Sparkles size={16} className="animate-spin mr-2"/> Enhancing...</span>
                                ) : (
                                    <span className="flex items-center">Preview Beautiful Wish <Send size={16} className="ml-2"/></span>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Preview State */}
                    {previewWish && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="bg-stone-50 p-6 rounded border border-stone-200 relative">
                                <Sparkles size={20} className="absolute top-4 right-4 text-stone-300" />
                                <p className="font-serif text-xl italic text-stone-700 leading-relaxed">"{previewWish}"</p>
                                <p className="mt-4 text-sm uppercase tracking-wider text-stone-500">— {name}</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleRejectPreview} className="flex-1 border border-stone-300 text-stone-600 uppercase tracking-widest text-xs py-3 hover:bg-stone-100 transition-colors">
                                    Edit Original
                                </button>
                                <button onClick={handleConfirmSubmit} className="flex-1 bg-stone-800 text-white uppercase tracking-widest text-xs py-3 hover:bg-stone-700 transition-colors">
                                    Submit Wish
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Success State */}
                    {isSubmitted && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-stone-600">
                            <CheckCircle2 size={48} className="text-stone-400 mb-4" strokeWidth={1} />
                            <p className="text-lg font-serif">Thank you for your beautiful words.</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Display Wishes */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <AnimatePresence>
                    {wishes.map((wish, idx) => (
                        <motion.div 
                            key={wish.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 shadow-sm border border-stone-100"
                        >
                            <p className="font-serif text-lg italic text-stone-600 mb-4 leading-relaxed">"{wish.text}"</p>
                            <p className="text-xs uppercase tracking-widest text-stone-400 flex items-center justify-between">
                                <span>— {wish.name}</span>
                                {wish.isFormatted && <Sparkles size={12} className="text-stone-300" />}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </SectionContainer>
    );
};

const RsvpSection = () => {
    const [status, setStatus] = useState('attending');
    const [guestCount, setGuestCount] = useState('');
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setRsvpSubmitted(true);
    };

    return (
        <SectionContainer id="rsvp" className="bg-white border-t border-stone-100">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">Will you join us?</h2>
                <p className="text-stone-500 mb-12">Kindly respond by November 1st, 2026.</p>
                
                {rsvpSubmitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 px-6 bg-stone-50 border border-stone-200 rounded text-center">
                        <CheckCircle2 size={48} className="text-stone-700 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-2xl font-serif text-stone-800 mb-2">RSVP Received</h3>
                        <p className="text-stone-600 text-sm">Thank you for letting us know! We look forward to celebrating with you.</p>
                        <button onClick={() => setRsvpSubmitted(false)} className="mt-6 text-xs uppercase tracking-widest text-stone-500 underline hover:text-stone-800">
                            Edit Response
                        </button>
                    </motion.div>
                ) : (
                    <form className="space-y-8 text-left" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button 
                                type="button"
                                onClick={() => setStatus('attending')}
                                className={`py-4 px-6 border uppercase tracking-widest text-sm transition-all ${status === 'attending' ? 'bg-stone-800 text-white border-stone-800' : 'bg-transparent text-stone-500 border-stone-300 hover:border-stone-800'}`}
                            >
                                Joyfully Accept
                            </button>
                            <button 
                                type="button"
                                onClick={() => setStatus('declining')}
                                className={`py-4 px-6 border uppercase tracking-widest text-sm transition-all ${status === 'declining' ? 'bg-stone-800 text-white border-stone-800' : 'bg-transparent text-stone-500 border-stone-300 hover:border-stone-800'}`}
                            >
                                Regretfully Decline
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <input type="text" placeholder="Full Name" className="w-full border-b border-stone-300 bg-transparent py-3 focus:outline-none focus:border-stone-800 transition-colors placeholder:uppercase placeholder:tracking-wider placeholder:text-xs text-stone-800" required />
                            </div>
                            <div>
                                <input type="email" placeholder="Email Address" className="w-full border-b border-stone-300 bg-transparent py-3 focus:outline-none focus:border-stone-800 transition-colors placeholder:uppercase placeholder:tracking-wider placeholder:text-xs text-stone-800" required />
                            </div>
                            {status === 'attending' && (
                                <div>
                                    <select 
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(e.target.value)}
                                        className="w-full border-b border-stone-300 bg-transparent py-3 focus:outline-none focus:border-stone-800 transition-colors text-stone-500 uppercase tracking-wider text-xs appearance-none"
                                        required
                                    >
                                        <option value="" disabled>Number of Guests</option>
                                        <option value="1">Just Me (1)</option>
                                        <option value="2">Plus One (2)</option>
                                        <option value="3">Family of 3</option>
                                        <option value="4">Family of 4</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        <button type="submit" className="w-full bg-stone-800 text-white uppercase tracking-widest text-sm py-5 mt-8 hover:bg-stone-700 transition-colors">
                            Send RSVP
                        </button>
                    </form>
                )}
            </div>
        </SectionContainer>
    );
};

const Footer = () => (
    <footer className="bg-stone-900 text-stone-400 py-12 text-center">
        <h2 className="text-2xl font-serif text-white mb-4">Elias & Amelia</h2>
        <p className="text-sm tracking-widest uppercase mb-8">{WEDDING_HASHTAG}</p>
        <p className="text-xs text-stone-600">&copy; 2026. Made with love.</p>
    </footer>
);

export default function App() {
    return (
        <div className="min-h-screen font-sans bg-stone-50 text-stone-800 selection:bg-stone-200 selection:text-stone-900">
            {/* Minimalist Header/Nav */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="font-serif text-xl tracking-wider">E <span className="text-stone-300 mx-1">&amp;</span> A</div>
                    <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest text-stone-500">
                        <a href="#details" className="hover:text-stone-900 transition-colors">Details</a>
                        <a href="#wishes" className="hover:text-stone-900 transition-colors">Wishlist</a>
                        <a href="#rsvp" className="hover:text-stone-900 transition-colors">RSVP</a>
                    </nav>
                </div>
            </header>

            <main>
                <HeroSection />
                <CountdownTimer />
                <DetailsSection />
                <WishlistSection />
                <RsvpSection />
            </main>
            
            <Footer />
        </div>
    );
}