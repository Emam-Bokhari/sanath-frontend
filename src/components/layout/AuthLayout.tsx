import Image from "next/image";

interface Props {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
    return (
        <div className="flex flex-col md:flex-row min-h-[80vh]">
            {/* Left Panel */}
            <div className="relative hidden md:flex md:w-5/12 lg:w-1/2 items-center justify-center p-10 overflow-hidden">
                <Image
                    src="/authSidebarImg.jpg"
                    alt="Property background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(135deg,rgba(15,23,43,0.55)_0%,rgba(0,4,9,0.531214)_48.16%,rgba(0,4,9,0.531214)_48.48%,rgba(0,4,10,0.55)_50%,rgba(0,0,0,0.55)_100%)]" />
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-white text-3xl lg:text-5xl font-extrabold leading-tight mb-3">
                        Find your perfect home in the UK
                    </h1>
                    <p className="text-white/75 text-lg leading-relaxed">
                        Search 500,000+ properties to buy and rent across England, Scotland, Wales and Northern
                        Ireland.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center px-5 py-12 bg-white">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}