interface TestimonialCardProps {
    quote: string;
    name: string;
    role: string;
    initials: string;
    rating?: number;
}

export default function TestimonialCard({
    quote,
    name,
    role,
    initials,
    rating = 5,
}: TestimonialCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
            {/* Stars */}
            <div className="flex gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#f5a623] fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>

            {/* Quote */}
            <p className="text-gray-600 text-sm leading-relaxed flex-1">"{quote}"</p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-[#0f2a4a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                </div>
                <div>
                    <p className="text-gray-900 font-semibold text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{role}</p>
                </div>
            </div>
        </div>
    );
}